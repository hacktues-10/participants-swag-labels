const participants = [
  {
    Име: "Име Фамилия",
    "Клас/Випуск": "11Г",
    Отбор: "Финал на завършили",
    Тениска: "XS",
  },
];

type Participant = (typeof participants)[0];

function Participant(props: { participant: Participant }) {
  return (
    <div className="border-4 w-full flex flex-col justify-between h-full break-inside-avoid-page border-black p-8">
      <div>
        <h1 className="text-4xl font-black">{props.participant["Име"]}</h1>
        <h1 className="text-3xl font-bold">
          {props.participant["Клас/Випуск"]}
        </h1>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{props.participant["Отбор"]}</h2>
        <h2 className="text-2xl font-semibold">
          {props.participant["Тениска"]}
        </h2>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="grid mx-auto place-items-center items-stretch gap-3 grid-cols-2">
      {participants.map((participant, index) => (
        <Participant key={index} participant={participant} />
      ))}
      <div className="w-full"></div>
    </div>
  );
}

export default App;
