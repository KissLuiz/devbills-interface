import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import TransactionTypesSelector from "../components/TransactionTypesSelector";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import type { Category } from "../types/category";
import {
  type CreateTransactionDTO,
  TransactionType,
} from "../types/transactions";

interface FormData {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
}

const initialFormData: FormData = {
  description: "",
  amount: 0,
  date: "",
  categoryId: "",
  type: TransactionType.EXPENSE,
};

const TransactionsForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const formId = useId();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const response = await getCategories();
      setCategories(response);
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type,
  );

  const validadeForm = (): boolean => {
    if (
      !formData.description ||
      !formData.amount ||
      !formData.date ||
      !formData.categoryId
    ) {
      setError("Preencha todos os campos");
      return false;
    }

    if (formData.amount <= 0) {
      setError("O valor deve ser maior que 0");
      return false;
    }

    return true;
  };

  const handleTransactionType = (itemType: TransactionType) => {
    setFormData((prev) => ({ ...prev, type: itemType }));
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validadeForm()) {
        return;
      }

      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: formData.amount,
        categoryId: formData.categoryId,
        date: `${formData.date}T12:00:00.000Z`,
        type: formData.type,
      };

      await createTransaction(transactionData);
      toast.success("Transação criada com sucesso!");
      navigate("/transacoes");
    } catch (_error) {
      toast.error("Falha ao adicionar transação, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }

    console.log(event);
  };

  const handleCancel = () => {
    navigate("/transacoes");
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container-app py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
        <Card>
          {error && (
            <div className="flex items-center bg-red-300 border border-red-700 rounded-xl p-4 mb-6 gap-2">
              <AlertCircle className="h-4 w-4 text-red-700" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex gap-2 flex-col">
              <label htmlFor={formId} className="mb-4">
                Tipo de Transação
              </label>
              <TransactionTypesSelector
                id={formId}
                value={formData.type}
                onChange={handleTransactionType}
              />
            </div>

            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Supermercado, Barbearia, Salão de Beleza etc..."
            />

            <Input
              label="Valor"
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="R$ 0,00"
              icon={<DollarSign className="w-4 h-4" />}
            />

            <Input
              label="Data"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4" />}
            />

            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              icon={<Tag className="h-4 w-4" />}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
              required
            />

            <div className="flex justify-end space-x-3 mt-2">
              <Button type="button" onClick={handleCancel} variant="outline" disabled={loading}>
                
                Cancelar
              </Button>

              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 mr-2 border-t-2 border-b-2 border-black" />
                ) : (<Save className="h-4 w-4 mr-2" />)}
                
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;
