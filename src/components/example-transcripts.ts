import { LitElement, css, html } from 'lit';

const exampleTranscripts = [
  {
    genomeId: 'a7335667-93e7-11ec-a39d-005056b38ce3',
    transcriptId: 'ENST00000666593.2',
    note: 'Homo sapiens, BRCA2, forward strand'
  },
  {
    genomeId: 'a7335667-93e7-11ec-a39d-005056b38ce3',
    transcriptId: 'ENST00000641462.2',
    note: 'Homo sapiens, MAPK10, reverse strand'
  },
  {
    genomeId: 'a7335667-93e7-11ec-a39d-005056b38ce3',
    transcriptId: 'ENST00000589042.5',
    note: 'Homo sapiens, TTN, reverse strand'
  }
];

class ExampleTranscripts extends LitElement {
  static styles = css`
    ul {
      padding: 0;
    }

    li {
      list-style: none;
    }

    button {
      all: unset;
      color: blue;
      cursor: pointer;
    }

    button:focus {
      outline: revert;
    }
  `;


  onClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const button = event.currentTarget as HTMLButtonElement;
    const genomeId = button.dataset.genomeId;
    const transcriptId = button.dataset.transcriptId;

    const outgoingEvent = new CustomEvent('example-transcript-click', { detail: {genomeId, transcriptId} });
    this.dispatchEvent(outgoingEvent);
  }

  render() {
    return html`
      <ul>
        ${exampleTranscripts.map((data) => html`
          <li>
            <button
              @click=${this.onClick}
              data-genome-id="${data.genomeId}"
              data-transcript-id="${data.transcriptId}"
            >
              ${data.transcriptId}
            </button>
            <span>(${data.note})</span>
          </li>
        `)}
      </ul>
    `;
  }

}

customElements.define('example-transcripts', ExampleTranscripts);

