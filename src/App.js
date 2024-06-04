import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

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

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from("facts").select("*");

      if (category !== "all") {
        query = query.eq("category", category);
      }

      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);

      if (!error) setIsLoading(false);
      else alert("There is a problem getting data!");
      setFacts([...facts]);
    }
    getFacts();
  }, [category]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm
          setFacts={setFacts}
          facts={facts}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      ) : null}
      <main className="main">
        <CategoryFilter setCategory={setCategory} />
        {isLoading ? (
          <Loading />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loading() {
  return <p className="message">Loading ...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today i learned";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="today i learned logo" width="68" height="68" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((showForm) => !showForm)}
      >
        {showForm ? "close" : "SHARE A FACT"}
      </button>
    </header>
  );
}

function NewFactForm({ setFacts, facts, showForm, setShowForm }) {
  const [textValue, setTextValue] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category, setCategory] = useState("");
  const [isUpLoading, setIsUpLoading] = useState(false);
  const textLength = textValue.length;

  async function handleFormSubmit(e) {
    // 1.阻止默认事件
    e.preventDefault();
    console.log(textValue, source, category);
    // 2. 校验数据
    if (textValue && isValidHttpUrl(source) && category && textLength <= 200) {
      // console.log(textValue, source, category);
      // 3. 创建一个新的fact
      /*  const fact = {
        id: Math.round(Math.random() * 10000000),
        text: textValue,
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createIn: new Date().getFullYear(),
      }; */
      setIsUpLoading(true);
      const { data: fact, error } = await supabase
        .from("facts")
        .upsert({ text: textValue, source, category })
        .select();

      setIsUpLoading(false);
      // 4.添加新的fact到界面, 添加fact到state中
      if (!error) setFacts((facts) => [fact[0], ...facts]);
      // 5.重置表单
      setTextValue("");
      setSource("");
      setCategory("");
      // 6. 关闭表单
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="share a fact with the world..."
        value={textValue || ""}
        onChange={(e) => setTextValue(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source || ""}
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        value={category || ""}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Choose ccategory:</option>
        {CATEGORIES.map((cate) => (
          <option value={cate.name} key={cate.name}>
            {cate.name.toLocaleUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUpLoading}>
        POST
      </button>
    </form>
  );
}

function CategoryFilter({ setCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCategory("all")}
          >
            all
          </button>
        </li>
        {CATEGORIES.map((cate) => (
          <li className="category" key={cate.name}>
            <button
              className="btn btn-categorie"
              style={{ backgroundColor: cate.color }}
              onClick={() => setCategory(cate.name)}
            >
              {cate.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">No facts for this category yet! Create one?</p>
    );
  }
  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p className="facts-count">
        There are {facts.length} facts is the database. Add your own!{" "}
      </p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleAddBtn(columnName) {
    setIsDisabled(true);
    const { data: updateFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsDisabled(false);

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updateFact[0] : f))
      );
    }

    // console.log(updateFact, error, "handleAddBtn>>");
  }
  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[💩 DISPUTED]</span> : null}
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          (srouce)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleAddBtn("votesInteresting")}
          disabled={isDisabled}
        >
          👍{fact.votesInteresting}
        </button>
        <button
          onClick={() => handleAddBtn("votesMindblowing")}
          disabled={isDisabled}
        >
          🤯{fact.votesMindblowing}
        </button>
        <button
          onClick={() => handleAddBtn("votesFalse")}
          disabled={isDisabled}
        >
          ⛔️{fact.votesFalse}
        </button>
      </div>
    </li>
  );
}
export default App;
