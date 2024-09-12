<script lang="ts">
  import { browser } from "$app/environment";
  import type { PageData } from "./$types";
  import Header from "./Header.svelte";
  import Results from "./Results.svelte";

  export let data: PageData;

  let socket: WebSocket | undefined;

  let statuses: Record<string, "pending" | "blocked" | "unblocked"> = {};
  const checkBlocked = async (host: string) => {
    if (statuses[host] == "blocked") return true;
    if (statuses[host] == "unblocked") return false;

    if (!socket) {
      socket = new WebSocket(
        "wss://production-gc.lsfilter.com?a=0ef9b862-b74f-4e8d-8aad-be549c5f452a&customer_id=62-7845-A000",
      );
      socket.onclose = () => (socket = undefined);
      socket.onerror = () => (socket = undefined);
    }
    if (socket.readyState == 0) {
      console.log("waiting...");
      await new Promise((resolve) => socket!.addEventListener("open", resolve));
      console.log("ok");
    }

    if (statuses[host]) return;
    statuses[host] = "pending";
    socket.send(JSON.stringify({ action: "dy_lookup", host, customerId: "62-7845-A000" }));
    setTimeout(() => {
      if (statuses[host] == "pending") {
        console.log("retrying", host);
        delete statuses[host];
        checkBlocked(host);
      }
    }, 600);

    await new Promise((resolve) => {
      const handler = (e: MessageEvent) => {
        const d = JSON.parse(e.data);
        if (d.action == "host_lookup") {
          if (d.request.host != host) return;
          const category = d.cat;
          const blocked = [
            0, 3, 4, 5, 8, 11, 12, 13, 21, 28, 31, 32, 33, 38, 39, 42, 55, 60, 61, 66, 67, 70, 71,
            72, 78, 94, 100, 101, 102, 113, 116, 117, 118, 126, 134, 135, 137, 139, 140, 141, 144,
            200, 201, 202, 203, 1002, 1003,
          ].includes(category);

          statuses = { ...statuses, [host]: blocked ? "blocked" : "unblocked" };
          resolve(blocked);
          socket!.removeEventListener("message", handler);
        }
      };
      socket!.addEventListener("message", handler);
    });
  };

  let whitelisted: {
    title: string;
    url: string;
    description: string;
    domain: string;
  }[] = [];
  let blacklisted: {
    title: string;
    url: string;
    description: string;
    domain: string;
  }[] = [];

  $: if (data && data.data && browser) {
    whitelisted = data.data!.filter(
      (x) =>
        x.status == "w" || (x.status == "u" && statuses[new URL(x.url).hostname] == "unblocked"),
    );
    blacklisted = data.data!.filter(
      (x) => x.status == "b" || (x.status == "u" && statuses[new URL(x.url).hostname] == "blocked"),
    );
  }
  $: if (data && data.data && browser) {
    data.data!.filter((x) => x.status == "u").forEach((x) => checkBlocked(new URL(x.url).hostname));
  }
</script>

<svelte:head>
  {#if data.q}
    <title>{data.q} on 1984</title>
  {/if}
</svelte:head>
<Header q={data?.q} />
{#if whitelisted.length}
  <Results data={whitelisted} />
{/if}
{#if blacklisted.length}
  <div class="container">
    {#each blacklisted as result}
      <a href={result.url}>
        <p style:opacity="0.8" style:font-size="0.875rem">{result.domain}</p>
        <p style:font-size="0.875rem">{result.title}</p>
        <p style:margin-top="auto">Blocked</p>
      </a>
    {/each}
  </div>
{/if}
{#if !data.q}
  <p class="wrap">In a world awash with information, find solace in simplicity.</p>
  <div class="columns">
    <div>
      <h2>Ignorance is Strength</h2>
      <p>
        Why stumble upon digital dead ends? Our revolutionary search algorithm removes the very
        existence of blocked content from your results. What you can't see can't tempt you. Embrace
        the bliss of a curated reality.
      </p>
    </div>
    <div>
      <h2>Less is More</h2>
      <p>
        Gone are the days of encountering forbidden knowledge. Here, every click leads to sanctioned
        wisdom. Our search results are as pure as your intentions, comrade.
      </p>
    </div>
    <div>
      <h2>Big Brother is Proud</h2>
      <p>
        Explore without fear. Every query is a step towards enlightenment, every result a testament
        to approved truth. In this brave new world of search, curiosity is always rewarded - within
        bounds, of course.
      </p>
    </div>
  </div>
  <p class="wrap">Search with us. For NSD. For the future. For clarity.</p>
{/if}

<style>
  .wrap {
    text-align: center;

    background-color: #3b4252;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin: 0 1.5rem;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;

    margin-inline: 1.5rem;
    margin-block: 0.5rem;
  }
  .columns div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background-color: #3b4252;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
  .columns h2 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 2rem;
  }
  .container {
    display: flex;
    gap: 0.25rem;
    padding: 1.5rem;
  }
  .container a {
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
