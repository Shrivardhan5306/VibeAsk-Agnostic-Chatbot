async function run() {
  try {
    const res = await fetch('https://vibeask.onrender.com/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: "What is 2+2?" })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
