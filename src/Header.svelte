<script lang="ts">
  export let q: string = "";

  $: document.title = q ? `${q} (1984)` : "Literally 1984";
</script>

<header>
  <div class="logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="m16.95 14.675l-.925-.525q-.225-.125-.25-.4t.2-.45l2.35-1.75q.25-.2.538-.213t.562.138l.925.525q.225.125.238.4t-.188.45l-2.35 1.75q-.25.2-.537.213t-.563-.138M5 20q-.425 0-.712-.288T4 19t.288-.712T5 18h4v-5.95l-3-1.725q-.725-.425-.937-1.212T5.275 7.6l1.5-2.6q.425-.725 1.213-.937t1.512.212L17.725 9q.475.275.5.813t-.4.862l-3.85 2.875q-.5.35-1.075.388t-1.1-.263l-.8-.45V18q0 .825-.587 1.413T9 20z"
      />
    </svg>
    Literally 1984
  </div>

  <form>
    <input type="search" name="q" value={q} required placeholder="Newspeak in..." />
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="m7.825 16l2.875 2.875q.3.3.313.7t-.288.7t-.712.3t-.713-.3L4.7 15.7q-.15-.15-.213-.325T4.426 15t.063-.375t.212-.325l4.625-4.625q.3-.3.7-.287t.7.312q.275.3.287.7t-.287.7l-2.9 2.9H17V5q0-.425.288-.712T18 4t.713.288T19 5v9q0 .825-.587 1.413T17 16z"
        />
      </svg>
    </button>
  </form>
</header>

<style>
  header {
    display: flex;
    padding: 1.5rem;
    height: 6rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 800;
  }

  form {
    display: contents;
  }
  input {
    flex-grow: 1;
    border-radius: 9999px;
    padding: 0 1rem;
    margin-left: 0.5rem;

    background-color: #3b4252;
    z-index: 1;
  }
  button {
    display: flex;
    align-items: center;
    margin-left: -1.5rem;
    padding-left: 2.5rem;
    padding-right: 1.375rem;
    border-radius: 0 9999px 9999px 0;

    background-color: #434c5e;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: currentColor;
  }
</style>
