"use client";
import React from "react";

export type Status = "pendente" | "andamento" | "concluido";

interface StatusChecklistProps {
  value?: Status;
  id?:string,
  onChange?: (s: Status) => void;
  name?: string; // name do grupo de radios (útil se houver mais de um checklist)
}

export default function StatusChecklist({
  value = "pendente",
  id = "",
  onChange,
  name = "status-checklist",
}: StatusChecklistProps) {
  const [status, setStatus] = React.useState<Status>(value);
  console.log(id)
  React.useEffect(() => {
    setStatus(value);
  }, [value]);

  const handleChange = (s: Status) => {
    setStatus(s);
    onChange?.(s);
  };

  const Option = ({
    id,
    title,
    subtitle,
    iconClass,
    valueOption,
  }: {
    id: string;
    title: string;
    subtitle: string;
    iconClass: string;
    valueOption: Status;
  }) => {
    const active = status === valueOption;
    return (
      <label
        htmlFor={id}
        className={
          "flex items-center gap-3 p-3 rounded-lg border transition " +
          (active
            ? "border-green-500 bg-green-50 shadow-sm"
            : "border-gray-200 bg-white hover:shadow-sm")
        }
        style={{ cursor: "pointer" }}
      >
        <input
          id={id}
          type="radio"
          name={name}
          checked={active}
          onChange={() => handleChange(valueOption)}
          className="w-4 h-4 accent-green-600 border-gray-300"
        />

        {/* ícone principal */}
        <i className={`${iconClass} w-6 h-6 text-gray-600`} aria-hidden />

        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-800">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>

        {/* check de confirmação à direita */}
        {active && <i className="fas fa-check text-green-600 ml-2" aria-hidden />}
      </label>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-700">Status</p>

      <div className="flex flex-col gap-3">
        <Option
          id={`${name}-pendente`}
          title="Pendente"
          subtitle="Aguardando início"
          iconClass="fas fa-clock"
          valueOption="pendente"
        />

        <Option
          id={`${name}-andamento`}
          title="Em andamento"
          subtitle="Processando / em execução"
          iconClass="fas fa-spinner"
          valueOption="andamento"
        />

        <Option
          id={`${name}-concluido`}
          title="Concluído"
          subtitle="Finalizado com sucesso"
          iconClass="fas fa-check-circle"
          valueOption="concluido"
        />
      </div>
    </div>
  );
}
