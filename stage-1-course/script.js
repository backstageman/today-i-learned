/**
 * 初始化数据
 */
const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

/**
 * 获取元素
 */
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factList = document.querySelector(".fact-list");

/**
 * 清空元素
 */
factList.innerHTML = "";

/**
 * 获取数据
 */
loadFasts();
async function loadFasts() {
  const res = await fetch(
    "https://ukxnsqlanxsvnflpzcqo.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreG5zcWxhbnhzdm5mbHB6Y3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NDk0NzYsImV4cCI6MjAzMjIyNTQ3Nn0.jptLnfw296kmrZpoZ4v2mCX7cUzMzak0M7KwRUF1Lzs",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreG5zcWxhbnhzdm5mbHB6Y3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NDk0NzYsImV4cCI6MjAzMjIyNTQ3Nn0.jptLnfw296kmrZpoZ4v2mCX7cUzMzak0M7KwRUF1Lzs",
      },
    }
  );
  const data = await res.json();
  console.log(data);
  createFactsList(data);
}

function createFactsList(dataArray) {
  const factArr = dataArray.map(
    (item) => `
        <li class="fact">
          <p>
         ${item.text}
          <a
              class="source"
              href="${item.source}"
              target="_blank"
              alt="facebook"
              >(srouce)</a
          >
          </p>
          <span class="tag" style="background-color: ${
            CATEGORIES.find((cat) => cat.name === item.category).color
          }"
          >${item.category}</span
          >
          <div class="vote-buttons">
          <button>👍${item.votesInteresting}</button>
          <button>🤯${item.votesMindblowing}</button>
          <button>⛔️${item.votesFalse}</button>
          </div>
        </li>
      `
  );

  const factlists = factArr.join("");

  factList.insertAdjacentHTML("afterbegin", factlists);
}

btn.addEventListener("click", function (e) {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "CLose";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});
