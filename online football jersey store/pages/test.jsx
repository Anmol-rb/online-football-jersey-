export const Test = () => {
  const testJsonData = {
    userId: 1,
    id: 1,
    title: "MIS",
    body: "Sample Body"
  };

  const arrayJsonData = [
    { id: 1, name: "Anmol", lastName: "Ranabhat" },
    { id: 2, name: "Ram", lastName: "Sharma" },
    { id: 3, name: "Sita", lastName: "Thapa" },
    { id: 4, name: "Hari", lastName: "Khadka" }
  ];

  return (
    <>
      <h1>My User title is</h1>
      <p>{testJsonData.title}</p>

      <h2>All Users (with index)</h2>
      {arrayJsonData.map((item, index) => (
        <div key={item.id}>
          <p>{index + 1}. {item.name}</p>
        </div>
      ))}

      <h2>First 2 Users (slice)</h2>
      {arrayJsonData.slice(0, 2).map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
        </div>
      ))}

      <h2>Filtered Users (id &gt; 2)</h2>
      {arrayJsonData
        .filter((item) => item.id > 2)
        .map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
          </div>
        ))}
    </>
  );
};
