<script lang="ts">
  export let whitelisted: {
    title: string;
    url: string;
    description: string;
    domain: string;
  }[];
  export let blacklisted: {
    title: string;
    url: string;
    description: string;
    domain: string;
  }[];
</script>

<div class="list">
  {#each whitelisted as result}
    <a href={result.url}>
      <p class="domain">{result.domain}</p>
      <p class="title">{result.title}</p>
      <p>{@html result.description}</p>
    </a>
  {/each}
</div>
<div class="horizontal-list">
  {#each blacklisted as result}
    <a href={result.url}>
      <p style:opacity="0.8" style:font-size="0.875rem">{result.domain}</p>
      <p style:font-size="0.875rem">{result.title}</p>
      <p style:margin-top="auto">Blocked</p>
    </a>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
  }
  .list a {
    display: flex;
    flex-direction: column;
    color: inherit;
    text-decoration: none;

    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    transition: all 0.2s;
  }
  .list a:hover {
    background-color: #3b4252;
  }
  .list a:focus-visible,
  .list a:active {
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

  .horizontal-list {
    display: flex;
    gap: 0.25rem;
    padding: 1.5rem;
  }
  .horizontal-list a {
    display: flex;
    flex-direction: column;
    width: 10rem;
    height: 10rem;

    color: inherit;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #3b4252;
  }
</style>
