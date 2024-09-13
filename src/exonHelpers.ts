// https://github.com/Ensembl/ensembl-client/blob/7e1ff5c6c54c5bda75a82784c12607413e92a1c7/src/shared/helpers/exon-helpers/exonHelpers.ts

type MinimumExonFields = {
  index: number;
  relative_location: {
    start: number;
    end: number;
  }
};

type MinimumCDSFields = {
  relative_start: number;
  relative_end: number;
}

export type ExonWithRelativeLocationInCDS = {
  relative_location_in_cds: {
    start: number;
    end: number;
    length: number;
  } | null;
};


export const addRelativeLocationInCDSToExons = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exons: E[];
  cds: C | null;
}): Array<E & ExonWithRelativeLocationInCDS> => {
  const cds = params.cds;

  if (!cds) {
    return params.exons.map(exon => ({
      ...exon,
      relative_location_in_cds: null
    }));
  }

  const exons: Array<E & ExonWithRelativeLocationInCDS> = structuredClone(params.exons)
    .toSorted((a, b) => a.index - b.index)
    .map(exon => ({
    ...exon,
    relative_location_in_cds: null
  }));

  let lastPositionInCDS = 0;

  for (const exon of exons) {
    if (doesExonIncludeCDS({ exon, cds })) {
      // the transcript consists of a single exon, and includes UTRs
      const relativeStart = 1;
      const overlappingLength = cds.relative_end - cds.relative_start + 1;
      const relativeEnd = relativeStart + overlappingLength - 1;

      exon.relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: overlappingLength
      };
    } else if (!isWithinCDS({ exon, cds })) {
      // technically, this branch is not necessary, because all exons have been initialised with relative_location set to null
      exon.relative_location_in_cds = null;
    } else if (
      !isExonStartWithinCDS({ exon, cds }) &&
      isExonEndWithinCDS({ exon, cds })
    ) {
      // first exon in CDS
      const relativeStart = 1;
      const remainingExonLength =
        exon.relative_location.end - cds.relative_start + 1;
      const relativeEnd = relativeStart + remainingExonLength - 1;

      exon.relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: remainingExonLength
      };

      lastPositionInCDS = relativeEnd;
    } else if (
      isExonStartWithinCDS({ exon, cds }) &&
      !isExonEndWithinCDS({ exon, cds })
    ) {
      // last exon in CDS
      const relativeStart = lastPositionInCDS + 1;
      const remainingExonLength =
        cds.relative_end - exon.relative_location.start + 1;
      const relativeEnd = relativeStart + remainingExonLength - 1;

      exon.relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: remainingExonLength
      };
    } else {
      // exon fully within CDS
      const relativeStart = lastPositionInCDS + 1;
      const exonLength =
        exon.relative_location.end - exon.relative_location.start + 1;
      const relativeEnd = relativeStart + exonLength - 1;

      exon.relative_location_in_cds = {
        start: relativeStart,
        end: relativeEnd,
        length: exonLength
      };

      lastPositionInCDS = relativeEnd;
    }
  }

  return exons;
}


const doesExonIncludeCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  const { exon, cds } = params;

  return (
    cds.relative_start >= exon.relative_location.start &&
    cds.relative_end <= exon.relative_location.end
  );
};

const isWithinCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  return isExonStartWithinCDS(params) || isExonEndWithinCDS(params);
};

const isExonStartWithinCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  const { exon, cds } = params;

  return (
    exon.relative_location.start >= cds.relative_start &&
    exon.relative_location.start < cds.relative_end
  );
};

const isExonEndWithinCDS = <
  E extends MinimumExonFields,
  C extends MinimumCDSFields
>(params: {
  exon: E;
  cds: C;
}) => {
  const { exon, cds } = params;

  return (
    exon.relative_location.end > cds.relative_start &&
    exon.relative_location.end <= cds.relative_end
  );
};
