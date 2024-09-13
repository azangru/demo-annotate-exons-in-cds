import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';

class ExonInCDS extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr auto;
      column-gap: 1.6rem;
      font-family: monospace;
    }

    .sequence {
      word-break: break-all;
    }
  `;

  @property({ type: Object })
  data!: {
    sequence: string;
    exon: {
      stable_id: string;
    }
  };

  render() {
    const { sequence, exon } = this.data;

    return html`
      <div class="sequence">
        ${sequence}
      </div>
      <div class="exon-id">
        ${exon.stable_id}
      </div>
    `;
  }

}

customElements.define('exon-in-cds', ExonInCDS);
