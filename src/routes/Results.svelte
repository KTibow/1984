<script lang="ts">
  export let data: {
    title: string;
    url: string;
    description: string;
    domain: string;
  }[];
</script>

<div class="list">
  {#each data as result}
    <a href={result.url}>
      <p class="domain">{result.domain}</p>
      <p class="title">{result.title}</p>
      <p>{@html result.description}</p>
    </a>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
  }
  a {
    display: flex;
    flex-direction: column;
    color: inherit;
    text-decoration: none;

    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    transition: all 0.2s;
  }
  a:hover {
    background-color: #3b4252;
  }
  a:focus-visible,
  a:active {
    background-color: #434c5e;
  }

  .domain {
    opacity: 0.75;
    font-size: 0.875rem;
  }
  .title {
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }
</style>
