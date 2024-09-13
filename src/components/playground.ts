import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';

import './transcript-input-form';
import './example-transcripts';
import './split-cds'

class Playground extends LitElement {
  static styles = css`
    .top {
      display: grid;
      justify-content: center;
      grid-template-columns: 1fr min-content 1fr;
      column-gap: 2.6rem;
      padding-bottom: 1rem;
    }

    h1 {
      font-size: 1.6rem;
    }

    div:has(> transcript-input-form) {
      justify-self: end;
      padding-right: 3em;
    }

    div:has(> example-transcripts) {
      padding-left: 3em;
    }

    .top >:nth-child(2) {
      padding-top: 1.4rem;
    }

    split-cds {
      max-width: 800px;
      margin: 1rem auto 0 auto;
      padding-bottom: 90px;
    }
  `;

  @state()
  genomeId: string | null = null;

  @state()
  transcriptId: string | null = null;

  onTranscriptInputChange = (event: CustomEvent<{ genomeId: string, transcriptId: string }>) => {
    const { genomeId, transcriptId } = event.detail;

    this.genomeId = genomeId;
    this.transcriptId = transcriptId;
  }

  render() {
    const shouldRenderCds = this.genomeId && this.transcriptId;

    return html`
      <div class="top">
        <div>
          <h1>
            Fetch a transcript
          </h1>
          <transcript-input-form @change=${this.onTranscriptInputChange}></transcript-input-form>
        </div>

        <div>
          or
        </div>

        <div>
          <h1>
            Check out an example transcript
          </h1>
          <example-transcripts @click=${this.onTranscriptInputChange}></example-transcripts>
        </div>
      </div>

      <hr />

      ${shouldRenderCds ? html`
        <split-cds .genomeId=${this.genomeId} .transcriptId=${this.transcriptId}></split-cds>
      ` : null}
    `;
  }

}

customElements.define('x-playground', Playground);
