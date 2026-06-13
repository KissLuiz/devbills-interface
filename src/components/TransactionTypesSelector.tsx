import { TransactionType } from "../types/transactions";

interface TransactionTypesSelectorProps {
  value: TransactionType;
  id?: string;
  onChange: (type: TransactionType) => void;
}

const TransactionTypesSelector = ({
  value,
  id,
  onChange,
}: TransactionTypesSelectorProps) => {
  const transactionTypesButton = [
    {
      type: TransactionType.EXPENSE,
      label: "Despesa",
      activeClasses: "bg-red-500 border-red-500 text-red-700 font-semibold text-white",
      inactiveClasses:
        "bg-transaparent border-red-300 text-red-500 hover:bg-red-50",
    },
    {
      type: TransactionType.INCOME,
      label: "Receita",
      activeClasses: "bg-green-500 border-green-500 text-green-700 font-semibold text-black",
      inactiveClasses:
        "bg-transparent border-green-300 text-green-500 hover:bg-green-50",
    },
  ];

  return (
    <fieldset id={id} className="grid grid-cols-2 gap-4">
      {transactionTypesButton.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={`flex items-center justify-center border rounded-md py-2 px-4 cursor-pointer transition-all ${value === item.type ? item.activeClasses : item.inactiveClasses}`}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypesSelector;
