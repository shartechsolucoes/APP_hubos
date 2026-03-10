import React, { useState, useEffect } from "react";
import "./manual.css";
import { RiLoginBoxFill } from "react-icons/ri";
import { MdDashboard, MdDocumentScanner, MdTipsAndUpdates } from "react-icons/md";
import { BiSolidReport, BiSupport } from "react-icons/bi";
import { SiProtondrive } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

import loginImg from "../../assets/login.png";
import loginImg02 from "../../assets/login-02.png";
import loginImg03 from "../../assets/login-03.png";
import dashboardImg from "../../assets/dashboard.png";
import ordensImg from "../../assets/OS.png";
import relatoriosImg from "../../assets/relatorios.png";
import protocolosImg from "../../assets/protocolos.png";
import dicasImg from "../../assets/dicas.png";
import suporteImg from "../../assets/suporte.png";

/* ✅ IMPORTAÇÃO ADICIONADA — arquivo PDF da pasta assets */
import tutorialPDF from "../../assets/Tutorial.pdf";

type SubStep = {
  title: string;
  description: string;
  bullets?: string[];
  image?: string;
  tip?: string;
};

type Section = {
  label: string;
  icon?: React.ReactNode;
  steps: SubStep[];
};

const SECTIONS: Record<string, Section> = {
  login: {
    label: "Login",
    icon: <RiLoginBoxFill />,
    steps: [
      {
        title: "Abrir o sistema",
        description: "Abra o navegador e acesse a URL do GeoOS fornecida pela sua organização.",
        bullets: ["Ex.: https://app.geoos.com.br", "Recomendado: usar Chrome/Edge atualizados"],
        image: loginImg,
      },
      {
        title: "Inserir credenciais",
        description: "Preencha usuário e senha nos campos correspondentes.",
        bullets: ["Usuário: seu e-mail institucional", "Senha: senha fornecida pelo setor de TI"],
        image: loginImg02,
      },
      {
        title: "Primeiro acesso / trocar senha",
        description: "Ao primeiro acesso, você pode ser solicitado a trocar a senha.",
        tip: "Se for solicitado, crie uma senha forte e anote em local seguro.",
        image: loginImg03,
      },
    ],
  },

  dashboard: {
    label: "Dashboard",
    icon: <MdDashboard />,
    steps: [
      {
        title: "Visão geral",
        description: "O painel inicial exibe KPIs: OS abertas, em andamento e concluídas.",
        bullets: ["Use os filtros no topo para alterar período", "Clique em qualquer cartão para abrir detalhes"],
        image: dashboardImg,
      },
      {
        title: "Mapas e alertas",
        description: "Veja o mapa com pontos de iluminação e alertas críticos em vermelho.",
        image: dashboardImg,
      },
    ],
  },

  ordens: {
    label: "Ordens de Serviço",
    icon: <MdDocumentScanner />,
    steps: [
      {
        title: "Lista de OS",
        description: "Abaixo do mapa está a lista com as ordens do dia.",
        bullets: ["Clique numa OS para ver detalhes", "Use o filtro por status e tipo"],
        image: ordensImg,
      },
      {
        title: "Visualizar detalhe da OS",
        description: "No detalhe você vê fotos, histórico e pode enviar um relatório.",
        bullets: ["Anexar foto: botão 'Adicionar foto'", "Alterar status: selecionar e salvar"],
        image: ordensImg,
      },
      {
        title: "Registrar atendimento",
        description: "Depois de executar a tarefa, registre o atendimento com foto e observações.",
        tip: "Use o campo 'Tempo gasto' para controle de produtividade.",
        image: ordensImg,
      },
    ],
  },

  relatorios: {
    label: "Relatórios",
    icon: <BiSolidReport />,
    steps: [
      {
        title: "Gerar relatório",
        description: "Selecione período, tipo de OS e clique em 'Gerar'.",
        image: relatoriosImg,
      },
    ],
  },

  protocolos: {
    label: "Protocolos",
    icon: <SiProtondrive />,
    steps: [
      {
        title: "Abrir protocolo",
        description: "Registre protocolos vinculados a solicitações de usuários.",
        image: protocolosImg,
      },
    ],
  },

  dicas: {
    label: "Dicas",
    icon: <MdTipsAndUpdates />,
    steps: [
      {
        title: "Boas práticas",
        description: "Dicas para melhorar uso do sistema e segurança das informações.",
        bullets: ["Sempre faça logout em computadores públicos", "Use fotos claras e datadas"],
        image: dicasImg,
      },
    ],
  },

  suporte: {
    label: "Suporte",
    icon: <BiSupport />,
    steps: [
      {
        title: "Contatar suporte",
        description: "Se precisar de ajuda, use os canais abaixo.",
        bullets: ["Email: suporte@geoos.com.br", "Telefone: (11) 99999-9999 — atendimento 8h-18h"],
        image: suporteImg,
      },
    ],
  },
};

export default function Manual() {
  const [sectionKey, setSectionKey] = useState<keyof typeof SECTIONS>("login");
  const [stepIndex, setStepIndex] = useState(0);
  const section = SECTIONS[sectionKey];
  const steps = section.steps;
  const current = steps[stepIndex];

  useEffect(() => {
    setStepIndex(0);
  }, [sectionKey]);

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight") {
        goNext();
      } else if (ev.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stepIndex, sectionKey]);

  const goNext = () => {
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  };
  const goPrev = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="ps-manual-container container">
      <aside className="ps-sidebar">
        <div className="ps-brand">
          <strong>Manual GeoOS</strong>
        </div>

        <ul className="ps-sections">
          {Object.entries(SECTIONS).map(([key, sec]) => (
            <li key={key}>
              <button
                className={key === sectionKey ? "active" : ""}
                onClick={() => setSectionKey(key as keyof typeof SECTIONS)}
                aria-label={`Abrir seção ${sec.label}`}
              >
                <span className="ps-icon">{sec.icon}</span>
                <span className="ps-label">{sec.label}</span>
                <span className="ps-count">{sec.steps.length}</span>
              </button>
            </li>
          ))}
        </ul>

                <div className="ps-sidebar-footer">
          <button
            onClick={() => window.open(tutorialPDF, "_blank")}
            className="ps-print-btn"
            aria-label="Abrir manual em PDF"
          >
            Imprimir
          </button>
        </div>

      </aside>

      <main className="ps-content">
        <div className="ps-header">
          <h1>{section.label}</h1>
          <div className="ps-progress">
            <div className="ps-progress-bar" aria-hidden>
              <div
                className="ps-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="ps-progress-text">
              Passo {stepIndex + 1} de {steps.length} — {progress}%
            </div>
          </div>
        </div>

        <div className="ps-step-area">
          <aside className="ps-step-right">
            <div className="ps-steps-list">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  className={`ps-mini-step ${idx === stepIndex ? "current" : ""}`}
                  onClick={() => setStepIndex(idx)}
                  aria-label={`Ir para passo ${idx + 1}`}
                >
                  <span className="ps-mini-num">{idx + 1}</span>
                  <span className="ps-mini-title">{s.title}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="ps-step-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sectionKey}-${stepIndex}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="ps-step-card"
              >
                {current.image && (
                  <div className="ps-step-image-wrap">
                    <img
                      src={current.image}
                      alt={current.title}
                      className="ps-step-image"
                    />
                  </div>
                )}

                <h2 className="ps-step-title">
                  {stepIndex + 1}. {current.title}
                </h2>

                <p className="ps-step-desc">{current.description}</p>

                {current.bullets && (
                  <ul className="ps-step-bullets">
                    {current.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {current.tip && <div className="ps-step-tip">💡 {current.tip}</div>}
              </motion.div>
            </AnimatePresence>

            <div className="ps-step-controls">
              <button
                onClick={goPrev}
                disabled={stepIndex === 0}
                aria-label="Passo anterior"
              >
                ← Anterior
              </button>
              <button
                onClick={goNext}
                disabled={stepIndex === steps.length - 1}
                aria-label="Próximo passo"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
