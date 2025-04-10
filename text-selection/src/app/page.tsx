"use client";

import SelectMenu from "@/components/SelectMenu";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Text Selection example</h1>
      <div>
        <SelectMenu />
        <p className="p-5">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
          obcaecati veniam aut quo natus! Aspernatur aut dignissimos tempora
          dolor eum praesentium qui ea, facilis libero ipsam, molestiae ab quia
          corporis?
        </p>
        <p className="p-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id fuga neque
          obcaecati optio aliquid omnis nobis iste maiores repellendus
          recusandae ipsum soluta, non nam rem assumenda adipisci consequatur
          praesentium ad.
        </p>
      </div>
    </div>
  );
}
