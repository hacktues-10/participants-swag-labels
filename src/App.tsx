import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useState, useEffect } from "react";
import { z } from "zod";

const labelSchema = z.array(
  z.object({
    Име: z.coerce.string(),
    "Клас/Фирма": z.coerce.string(),
    "Отбор/Комисия": z.coerce.string(),
    Тениска: z.coerce.string(),
  })
);

type Label = z.infer<typeof labelSchema>[number];

// CSS for print styling
const printStyles = `
@media print {
  @page {
    size: A4;
    margin: 10mm; /* Standard minimum margin for most printers */
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  .print-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 52.2mm; /* A4 height divided by 5 rows, minus margins */
    gap: 4mm;
    width: 190mm; /* A4 width minus margins */
  }
  
  .label-container {
    width: 93mm; /* Half A4 width minus margins and gap */
    height: 52.2mm; /* One fifth of A4 height minus margins and gaps */
    page-break-inside: avoid;
    break-inside: avoid;
    overflow: hidden;
    box-sizing: border-box;
  }
}
`;

function LabelDisplay(props: { label: Label }) {
  return (
    <div className="label-container border-2 flex flex-col justify-between border-black p-3">
      <div className="overflow-hidden">
        <h1
          className="text-xl font-black overflow-ellipsis"
          style={{
            maxHeight: "1.4em",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "0 0 2px 0",
          }}
        >
          {props.label["Име"]}
        </h1>
        <h2
          className="text-lg font-bold overflow-ellipsis"
          style={{
            maxHeight: "1.2em",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "0",
          }}
        >
          {props.label["Клас/Фирма"]}
        </h2>
      </div>
      <div>
        <h3
          className="text-base font-semibold overflow-ellipsis"
          style={{
            maxHeight: "1.2em",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "0",
          }}
        >
          {props.label["Отбор/Комисия"]}
        </h3>
        <h3
          className="text-base font-semibold overflow-ellipsis"
          style={{
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "0",
          }}
        >
          {props.label["Тениска"]}
        </h3>
      </div>
    </div>
  );
}

function App() {
  const [labels] = useState<Label[]>(() => {
    const labelsParam = new URLSearchParams(window.location.search).get(
      "labels"
    );
    if (labelsParam) {
      try {
        const decompressed = decompressFromEncodedURIComponent(labelsParam);
        return labelSchema.parse(JSON.parse(decompressed));
      } catch {}
    }
    return [];
  });

  // Set document title based on 'title' query parameter
  useEffect(() => {
    const titleParam = new URLSearchParams(window.location.search).get("title");
    if (titleParam) {
      document.title = titleParam;
    }
  }, []);

  useEffect(() => {
    // Check if the print parameter is set to 1
    const shouldPrint =
      new URLSearchParams(window.location.search).get("print") === "1";

    if (shouldPrint && labels.length > 0) {
      // Use a small timeout to ensure the page is fully rendered
      const printTimeout = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(printTimeout);
    }
  }, [labels]);

  // Inject print styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (labels.length === 0) {
    const prompt = window.prompt("Enter labels JSON");
    if (prompt) {
      const compressed = compressToEncodedURIComponent(prompt);
      console.log({ compressed });
      window.location.search = `?labels=${compressed}`;
    }
  }

  return (
    <>
      <div className="print-grid mx-auto">
        {labels.map((label, index) => (
          <LabelDisplay key={index} label={label} />
        ))}
      </div>
    </>
  );
}

export default App;
