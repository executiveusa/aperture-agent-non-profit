export default function DemoCheckout() {
  return (
    <main>
      <h2>Demo Checkout Route</h2>
      <form aria-label="checkout form">
        <label>Email <input type="email" name="email" /></label>
        <label>Amount <input type="number" name="amount" defaultValue={25} /></label>
        <button type="submit">Donate</button>
      </form>
    </main>
  );
}
