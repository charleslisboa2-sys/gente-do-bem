// === scripts.js ===
// Gente do Bem - gentedobem.org.br
// Responsável por aplicar máscaras, buscar endereço via CEP e validar o formulário

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  const cepInput = document.getElementById("cep");
  const telefoneInput = document.getElementById("telefone");
  const mensagemSucesso = document.getElementById("mensagemSucesso");

  // === Máscara de telefone ===
  telefoneInput?.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      valor = valor.replace(/^(\d*)/, "($1");
    }
    e.target.value = valor;
  });

  // === Máscara de CEP ===
  cepInput?.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
    }
    e.target.value = valor;
  });

  // === Buscar endereço via API do ViaCEP ===
  cepInput?.addEventListener("blur", async () => {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      document.getElementById("endereco").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("uf").value = data.uf || "";
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Não foi possível consultar o CEP. Tente novamente.");
    }
  });

  // === Envio do formulário ===
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    mensagemSucesso.style.display = "block";
    form.reset();

    // Rolagem suave até a mensagem
    mensagemSucesso.scrollIntoView({ behavior: "smooth" });
  });
});
