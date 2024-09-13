import { gql, request } from 'graphql-request';

import { addRelativeLocationInCDSToExons } from './exonHelpers';

import type { Transcript } from './types';

const document = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(
      by_id: {genome_id: $genomeId, stable_id: $transcriptId}
    ) {
      stable_id
      slice {
        location {
          start
          end
          length
        }
      }
      spliced_exons {
        index
        relative_location {
          start
          end
          length
        }
        exon {
          stable_id
        }
      }
      product_generating_contexts {
        cdna {
          sequence {
            checksum
          }
        }
        cds {
          relative_start
          relative_end
          sequence {
            checksum
          }
        }
      }
    }
  }
`



export const fetchTranscript = async ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  // const graphqlHost = 'https://beta.ensembl.org/data/graphql/';
  const graphqlHost = 'https://beta.ensembl.org/api/graphql/core';

  const response = await request<{
    transcript: Transcript
  }>({
    url: graphqlHost,
    document,
    variables: {
      genomeId,
      transcriptId
    }
  });
  return response.transcript
};


export const fetchSequence = async (checksum: string) => {
  const baseUrl = `https://beta.ensembl.org/api/refget/sequence`;

  const url = `${baseUrl}/${checksum}`;
  return await fetch(url).then((response) => response.text());
}




export const fetchData = async ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  // 1. Fetch transcript data
  const transcript = await fetchTranscript({
    genomeId,
    transcriptId
  });

  const productGeneratingContext = transcript.product_generating_contexts[0];

  // 2. Fetch cDNA sequence
  const cdnaChecksum = productGeneratingContext.cdna.sequence.checksum;
  const cdnaSequence = await fetchSequence(cdnaChecksum);

  // 3. Fetch CDS sequence
  const cdsChecksum = productGeneratingContext.cds?.sequence.checksum;
  let cdsSequence: string | null = null;

  if (cdsChecksum) {
    cdsSequence = await fetchSequence(cdsChecksum);
  }

  // 4. For spliced exons, calculate relative positions of the exons in the CDS
  const splicedExonsWithRelativeLocationInCDS = addRelativeLocationInCDSToExons({
    exons: transcript.spliced_exons,
    cds: productGeneratingContext.cds
  });

  return {
    transcript,
    splicedExonsWithRelativeLocationInCDS,
    cdnaSequence,
    cdsSequence
  };
};
