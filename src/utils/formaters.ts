export const formatToBRL = (value: string | number, clean?: boolean) => {
  if (!value) return clean ? "0,00" : "R$ 0,00";

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));

  if (clean) {
    return formattedValue.replace("R$", "");
  }

  return formattedValue;
};

export const formatToBRLCurrency = (value?: string | number) => {
  if (!value) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) / 100);
};

export const removeNonNumeric = (value: string) => {
  return value.replace(/\D/g, "");
};

export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Apply the Brazilian phone format: (00) 00000-0000
  return digits
    .replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, g1, g2, g3) => {
      if (!g1) return "";
      if (!g2) return `(${g1}`;
      if (!g3) return `(${g1}) ${g2}`;
      return `(${g1}) ${g2}-${g3}`;
    })
    .slice(0, 15); // Max length of (00) 00000-0000
}

export function parseFileName(filename: string): string {
  const [name, extension] = filename.toLowerCase().split(".");
  const lowerCaseName = name.split(" ").join("-");
  return `${lowerCaseName}.${extension}`;
}

export function parseCurrencyString(value: string): number {
  return Number(value.replace(/\D/g, "")) / 100;
}

export function formatDateTime(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleString("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function formatDayOfWeek(day: string): string {
  if (!day) return "";
  const days = {
    Dom: "Domingo",
    Seg: "Segunda-feira",
    Ter: "Terça-feira",
    Qua: "Quarta-feira",
    Qui: "Quinta-feira",
    Sex: "Sexta-feira",
    Sáb: "Sábado",
  };
  return days[day as keyof typeof days];
}
