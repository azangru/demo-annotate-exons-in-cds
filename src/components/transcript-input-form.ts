import { LitElement, css, html } from 'lit';


class TranscriptInputForm extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    input {
      width: 250px;
    }

    label:not(:first-of-type), button {
      margin-top: 1rem;
    }

    label {
      margin-bottom: 0.4rem;
    }
  `;

  onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const genomeIdInput = form['genome-id'] as HTMLInputElement;
    const genomeId = genomeIdInput.value;
    const transcriptIdInput = form['transcript-id'] as HTMLInputElement;
    const transcriptId = transcriptIdInput.value;

    if (genomeId && transcriptId) {
      const changeEvent = new CustomEvent('change', {
        detail: { genomeId, transcriptId }
      });
      this.dispatchEvent(changeEvent);
    }
  }


  render() {
    return html`
      <form @submit=${this.onSubmit}>
        <label for="genome-id">
          Genome id
        </label>
        <input id="genome-id" name="genome-id" type="text" />
        <label for="transcript-id">
          Transcript id
        </label>
        <input id="transcript-id" name="transcript-id" type="text" />

        <button>
          Submit
        </button>
      </form>
    `;
  }

}

customElements.define('transcript-input-form', TranscriptInputForm);
