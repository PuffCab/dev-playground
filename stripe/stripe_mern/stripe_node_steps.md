# Stripe with node

Install stripe `npm i stripe`
[Docs](https://github.com/stripe/stripe-node/blob/master/examples/webhook-signing/express/main.ts)

Tips:
- In case of buying items, you don't send the price from the client, because if we do it, a hacker could send a 0$ price and get items for free.