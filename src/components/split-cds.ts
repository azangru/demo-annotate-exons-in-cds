import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';

import { fetchData } from '../api';

import './exon-in-cds';

class SplitCDS extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      row-gap: 1rem
    }
  `;

  @property({ type: String })
  genomeId: string | null = null;

  @property({ type: String })
  transcriptId: string | null = null;

  @state()
  loading: boolean = false;

  @state()
  error: boolean = false;

  @state()
  data: Awaited<ReturnType<typeof fetchData>> | null = null;
  
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('genomeId') || changedProperties.has('transcriptId')) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    if (!this.genomeId || !this.transcriptId) {
      return;
    }

    this.error = false;
    this.loading = true;

    try {
      const data = await fetchData({
        genomeId: this.genomeId,
        transcriptId: this.transcriptId
      });
  
      this.data = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.error = true;
    }
  }

  render() {
    if (this.loading) {
      return html`
        Loading...
      `;
    } else if (this.error) {
      return html`
        Failed to fetch data
      `;
    }
    if (!this.data) {
      return null;
    }


    const { splicedExonsWithRelativeLocationInCDS, cdsSequence } = this.data;

    const fragments: Array<{sequence: string, exon: { stable_id: string }}> = [];

    for (const exon of splicedExonsWithRelativeLocationInCDS) {
      if (!cdsSequence || !exon.relative_location_in_cds) {
        continue;
      }

      const { relative_location_in_cds } = exon;
      const startIndexInCDS = relative_location_in_cds.start - 1;
      const endIndexInCDS = relative_location_in_cds.end; // end-exclusive
      const exonSequenceInCDS = cdsSequence.slice(startIndexInCDS, endIndexInCDS);

      const fragment = {
        sequence: exonSequenceInCDS,
        exon: exon.exon
      };
      fragments.push(fragment);
    }

    return html`
      ${fragments.map(fragment => html`
        <exon-in-cds .data=${fragment}></exon-in-cds>
      `)}
    `;
  }

}

customElements.define('split-cds', SplitCDS);
