<script lang="ts">
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import Results from "./Results.svelte";
  import { handleMathSearch, type MathResult } from "./lib/math";

  let q = "";
  let definition = "";
  let mathResult: MathResult | null = null;
  let _results: {
    status: string;
    title: string;
    url: string;
    description: string;
    domain: string;
  }[] = [];
  let whitelisted: typeof _results = [];
  let blacklisted: typeof _results = [];

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

    const handler = (e: MessageEvent) => {
      const d = JSON.parse(e.data);
      if (d.action == "host_lookup") {
        if (d.request.host != host) return;
        const category = d.cat;
        const blocked = [
          0, 3, 4, 5, 8, 11, 12, 13, 21, 28, 31, 32, 33, 38, 39, 42, 55, 60, 61, 66, 67, 70, 71, 72,
          78, 94, 100, 101, 102, 113, 116, 117, 118, 126, 134, 135, 137, 139, 140, 141, 144, 200,
          201, 202, 203, 1002, 1003,
        ].includes(category);

        statuses = { ...statuses, [host]: blocked ? "blocked" : "unblocked" };
        socket!.removeEventListener("message", handler);
      }
    };
    socket!.addEventListener("message", handler);
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    q = urlParams.get("q") || "";
    if (q) {
      fetchResults();
    }
  });

  async function fetchResults() {
    const response = await fetch(
      `https://1984function.azurewebsites.net/api/search?q=${encodeURIComponent(q)}`,
    );
    const json = await response.json();
    _results = json.results;
    definition = json.definition;
    mathResult = handleMathSearch(q);
  }

  $: {
    for (const result of _results) {
      if (result.status == "u") {
        checkBlocked(new URL(result.url).hostname);
      }
    }
    whitelisted = _results.filter(
      (x) =>
        x.status == "w" || (x.status == "u" && statuses[new URL(x.url).hostname] == "unblocked"),
    );
    blacklisted = _results.filter(
      (x) => x.status == "b" || (x.status == "u" && statuses[new URL(x.url).hostname] == "blocked"),
    );
  }
</script>

<Header {q} />

{#if q}
  {#if definition}
    <p class="result">{definition}</p>
  {/if}

  {#if mathResult}
    <p class="result">
      {mathResult.result}
      {#if mathResult.unit}{mathResult.unit}{/if}
    </p>
  {/if}
{/if}

{#if whitelisted.length || blacklisted.length}
  <Results {whitelisted} {blacklisted} />
{/if}
{#if !q}
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
  .result {
    font-size: 1.5rem;
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
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
  .wrap {
    text-align: center;

    background-color: #3b4252;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin: 0 1.5rem;
  }
</style>
