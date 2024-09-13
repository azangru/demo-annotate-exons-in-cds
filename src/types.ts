export type Slice = {
  location: LocationData;
};

export type LocationData = {
  start: number;
  end: number;
  length: number;
};

export type Exon = {
  stable_id: string;
}

export type SplicedExon = {
  index: number;
  exon: Exon;
  relative_location: LocationData;
}

export type CDNA = {
  sequence: {
    checksum: string;
  }
};

export type CDS = {
  relative_start: number;
  relative_end: number;
  sequence: {
    checksum: string;
  }
}

export type ProductGeneratingContext = {
  cdna: CDNA;
  cds: CDS | null;
}

export type Transcript = {
  stable_id: string;
  spliced_exons: SplicedExon[];
  product_generating_contexts: ProductGeneratingContext[];
};
