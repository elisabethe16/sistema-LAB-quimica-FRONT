import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Criação dos estados para armazenar os valores digitados no formulário
  const [usuario, setUsuario] = useState('');
  const [insumo, setInsumo] = useState('Ácido Aminoacético');
  const [finalidade, setFinalidade] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const registrar = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    if (!usuario || !insumo || !quantidade) {
      alert('Por favor, preencha todos os campos obrigatórios (Usuário, Insumo e Quantidade).');
      return;
    }

    const registro = {
      usuario: usuario,
      insumo: insumo,
      finalidade: finalidade,
      quantidade: parseInt(quantidade, 10)
    };

    try {
      // IMPORTANTE: Substitua a URL abaixo pela URL real gerada pelo seu back-end no Render
      await axios.post('https://sistema-lab-quimica-back.onrender.com/registrar', registro);
      
      alert('Registro efetuado com sucesso!');
      
      // Limpa os campos do formulário após o sucesso
      setUsuario('');
      setFinalidade('');
      setQuantidade('');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao conectar com o servidor back-end.');
    }
  };

  return (
    <div className="container">
      <img src="https://www.ufrpe.br/sites/default/files/logo_ufrpe_nova_0.png" alt="Logo UFRPE" className="logo-ufrpe" />

      <h2>Registro de Movimentação</h2>
      
      <label>Usuário:</label>
      <input 
        type="text" 
        placeholder="Nome do aluno/professor" 
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      
      <label>Insumo:</label>
      <select value={insumo} onChange={(e) => setInsumo(e.target.value)}>
        <optgroup label="Ácidos">
          <option value="Ácido Aminoacético">Ácido Aminoacético</option>
          <option value="Ácido Borico">Ácido Borico</option>
          <option value="Ácido Cítrico">Ácido Cítrico</option>
          <option value="Ácido L(+) Ascórbico">Ácido L(+) Ascórbico</option>
          <option value="Ácido Malico - DL">Ácido Malico - DL</option>
          <option value="Ácido Oxálico Cristal">Ácido Oxálico Cristal</option>
          <option value="Ácido Tricloroacetico">Ácido Tricloroacetico</option>
        </optgroup>
        <optgroup label="Indicadores">
          <option value="Alaranjado de Metila">Alaranjado de Metila</option>
          <option value="Azul de Bromotimol">Azul de Bromotimol</option>
          <option value="Azul de Metileno">Azul de Metileno</option>
          <option value="Azul de Timol">Azul de Timol</option>
          <option value="Fenolftaleina">Fenolftaleina</option>
          <option value="Rodamina B">Rodamina B</option>
        </optgroup>
        <optgroup label="Hidróxidos e Bases">
          <option value="Graxa de Silicone">Graxa de Silicone</option>
          <option value="Hidróxido de Magnésio">Hidróxido de Magnésio</option>
          <option value="Hidróxido de Potássio">Hidróxido de Potássio</option>
          <option value="Hidróxido de Sódio">Hidróxido de Sódio</option>
          <option value="Solução de Fenolftaleina">Solução de Fenolftaleina</option>
          <option value="Sulfato de Alumínio">Sulfato de Alumínio</option>
        </optgroup>
        <optgroup label="Sais">
          <option value="Acetato de Chumbo">Acetato de Chumbo</option>
          <option value="Acetato de Cobre">Acetato de Cobre</option>
          <option value="Acetato de Potassio">Acetato de Potassio</option>
          <option value="Acetato de Sódio">Acetato de Sódio</option>
          <option value="Bicarbonato de Amonio">Bicarbonato de Amonio</option>
          <option value="Bicarbonato de Sódio">Bicarbonato de Sódio</option>
          <option value="Biftalato de Potassio">Biftalato de Potassio</option>
          <option value="Carbonato de Amonio">Carbonato de Amonio</option>
          <option value="Carbonato de Potassio">Carbonato de Potassio</option>
          <option value="Carbonato de Sódio">Carbonato de Sódio</option>
          <option value="Carvão Ativo em Pó">Carvão Ativo em Pó</option>
          <option value="Citrato de Sódio">Citrato de Sódio</option>
          <option value="Cloreto de Bário">Cloreto de Bário</option>
          <option value="Cloreto de Calcio">Cloreto de Calcio</option>
          <option value="Cloreto de Cromo III ICO">Cloreto de Cromo III ICO</option>
          <option value="Cloreto de Ferro">Cloreto de Ferro</option>
          <option value="Cloreto de Magnésio">Cloreto de Magnésio</option>
          <option value="Cloreto de Potássio">Cloreto de Potássio</option>
          <option value="Cloreto de Prata">Cloreto de Prata</option>
          <option value="Cloreto de Sódio">Cloreto de Sódio</option>
          <option value="Cromato de Potássio">Cromato de Potássio</option>
          <option value="Dicromato de Potássio">Dicromato de Potássio</option>
          <option value="Edta (Sal Dissódico)">Edta (Sal Dissódico)</option>
          <option value="Ferrocianeto de Potássio">Ferrocianeto de Potássio</option>
          <option value="Fosfato de Amônio Monobásico">Fosfato de Amônio Monobásico</option>
          <option value="Fosfato de Potássio Bib. Anidro">Fosfato de Potássio Bib. Anidro</option>
          <option value="Fosfato de Potássio Monobásico">Fosfato de Potássio Monobásico</option>
          <option value="Fosfato de Sódio Bib. 12H2O">Fosfato de Sódio Bib. 12H2O</option>
          <option value="Fosfato de Sódio Bib. 2H2O">Fosfato de Sódio Bib. 2H2O</option>
          <option value="Fosfato de Sódio Bib. Anidro">Fosfato de Sódio Bib. Anidro</option>
          <option value="Fosfato de Sódio Monob. Anidro">Fosfato de Sódio Monob. Anidro</option>
          <option value="Hidroxido de Sódio (Microperolas)">Hidroxido de Sódio (Microperolas)</option>
          <option value="Iodeto de Potássio">Iodeto de Potássio</option>
          <option value="Mércurio Sulfato ICO II">Mércurio Sulfato ICO II</option>
          <option value="Nitrato de Cálcio">Nitrato de Cálcio</option>
          <option value="Nitrato de Chumbo II">Nitrato de Chumbo II</option>
          <option value="Nitrato de Prata">Nitrato de Prata</option>
          <option value="Oxalato de Sódio">Oxalato de Sódio</option>
          <option value="Permarganato de Potássio">Permarganato de Potássio</option>
          <option value="Silicagel Azul">Silicagel Azul</option>
          <option value="Sulfato de Amônio">Sulfato de Amônio</option>
          <option value="Sulfato de Bário">Sulfato de Bário</option>
          <option value="Sulfato de Calcio">Sulfato de Calcio</option>
          <option value="Sulfato de Cobre II (ICO)">Sulfato de Cobre II (ICO)</option>
          <option value="Sulfato de Ferro II OSO">Sulfato de Ferro II OSO</option>
          <option value="Sulfato de Ferro II OSO Amoniacal">Sulfato de Ferro II OSO Amoniacal</option>
          <option value="Sulfato de Magnésio">Sulfato de Magnésio</option>
          <option value="Sulfato de Sódio">Sulfato de Sódio</option>
          <option value="Sulfato de Zinco">Sulfato de Zinco</option>
          <option value="Tetraborato de Sódio">Tetraborato de Sódio</option>
          <option value="Tiocianato de Potássio">Tiocianato de Potássio</option>
          <option value="Tiocianato de Sódio">Tiocianato de Sódio</option>
          <option value="Tiossulfato de Sódio">Tiossulfato de Sódio</option>
          <option value="Tiossulfato de Sódio Anidro">Tiossulfato de Sódio Anidro</option>
          <option value="Zinco Metálico em Pó">Zinco Metálico em Pó</option>
        </optgroup>
        <optgroup label="Orgânicos">
          <option value="Agarose">Agarose</option>
          <option value="Antrona">Antrona</option>
          <option value="Butil Hidroxitolueno">Butil Hidroxitolueno</option>
          <option value="Caseína">Caseína</option>
          <option value="D - Lactose">D - Lactose</option>
          <option value="Difenilamina">Difenilamina</option>
          <option value="Fenantrolina">Fenantrolina</option>
          <option value="Frutose - D Pura">Frutose - D Pura</option>
          <option value="Glicerina">Glicerina</option>
          <option value="Glicina">Glicina</option>
          <option value="Glicose Anidra">Glicose Anidra</option>
          <option value="L - Prolina">L - Prolina</option>
          <option value="Metionina">Metionina</option>
          <option value="Murexida">Murexida</option>
          <option value="Nipagin">Nipagin</option>
          <option value="Nipazol">Nipazol</option>
          <option value="Óxido de Alumínio">Óxido de Alumínio</option>
          <option value="Pirocatequina">Pirocatequina</option>
          <option value="Polierilenoglicol">Polierilenoglicol</option>
          <option value="Tioureia">Tioureia</option>
          <option value="Ureia">Ureia</option>
          <option value="Vanilina - L">Vanilina - L</option>
          <option value="Xilose">Xilose</option>
        </optgroup>
      </select>

      <label>Finalidade (Aula/Experimento):</label>
      <input 
        type="text" 
        value={finalidade}
        onChange={(e) => setFinalidade(e.target.value)}
      />

      <label>Quantidade:</label>
      <input 
        type="number" 
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <button onClick={registrar}>Registrar Saída</button>
    </div>
  );
}

export default App;
