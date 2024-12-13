// kv-inspect.ts
async function inspectKV() {
    const kv = await Deno.openKv();
    
    try {
      console.log("KV Store Contents:");
      console.log("==================");
      
      // List all entries
      const entries = kv.list({ prefix: [] });
      let count = 0;
      
      for await (const entry of entries) {
        count++;
        console.log("\nEntry #" + count);
        console.log("Key:", entry.key);
        console.log("Value:", entry.value);
        console.log("Version:", entry.versionstamp);
      }
      
      if (count === 0) {
        console.log("No entries found in KV store.");
      } else {
        console.log("\nTotal entries:", count);
      }
      
    } finally {
      kv.close();
    }
  }
  
  // If you want to search for specific prefix
  async function inspectPrefix(prefix: string[]) {
    const kv = await Deno.openKv();
    
    try {
      console.log(`\nSearching for prefix: ${prefix.join("/")}`);
      console.log("==================");
      
      const entries = kv.list({ prefix });
      let count = 0;
      
      for await (const entry of entries) {
        count++;
        console.log("\nEntry #" + count);
        console.log("Key:", entry.key);
        console.log("Value:", JSON.stringify(entry.value, null, 2));
        console.log("Version:", entry.versionstamp);
      }
      
      if (count === 0) {
        console.log(`No entries found with prefix: ${prefix.join("/")}`);
      } else {
        console.log("\nTotal matching entries:", count);
      }
      
    } finally {
      kv.close();
    }
  }
  
  // Allow command line arguments
  if (import.meta.main) {
    const prefix = Deno.args[0]?.split("/").filter(Boolean) || [];
    if (prefix.length > 0) {
      await inspectPrefix(prefix);
    } else {
      await inspectKV();
    }
  }