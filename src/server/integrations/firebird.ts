/**
 * Integração com Firebird (CaptarePro)
 * 
 * Este módulo gerencia a conexão e sincronização de dados
 * entre o Captare ERP e o banco de dados Firebird do CaptarePro
 */

import * as Firebird from 'firebird';

interface FirebirdConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface SyncResult {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  errors?: string[];
}

/**
 * Classe para gerenciar conexão com Firebird
 */
export class FirebirdConnection {
  private config: FirebirdConfig;
  private connection: any;

  constructor(config: FirebirdConfig) {
    this.config = config;
  }

  /**
   * Conectar ao banco de dados Firebird
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const options = {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
      };

      Firebird.attach(options, (err: any, db: any) => {
        if (err) {
          reject(new Error(`Erro ao conectar ao Firebird: ${err.message}`));
        } else {
          this.connection = db;
          console.log('✅ Conectado ao Firebird com sucesso');
          resolve();
        }
      });
    });
  }

  /**
   * Desconectar do banco de dados
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        this.connection.detach((err: any) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Desconectado do Firebird');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Executar query no Firebird
   */
  async query(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        reject(new Error('Não conectado ao Firebird'));
        return;
      }

      this.connection.query(sql, params, (err: any, result: any) => {
        if (err) {
          reject(new Error(`Erro na query: ${err.message}`));
        } else {
          resolve(result || []);
        }
      });
    });
  }

  /**
   * Sincronizar clientes do CaptarePro
   */
  async syncClientes(): Promise<SyncResult> {
    try {
      const sql = `
        SELECT 
          CODCLI as id,
          NOMCLI as nome,
          ENDCLI as endereco,
          CIDCLI as cidade,
          ESTCLI as estado,
          CEPCLI as cep,
          TELCLI as telefone,
          EMACLI as email,
          CPFCLI as cpf,
          CNPJCLI as cnpj,
          DTACAD as data_cadastro
        FROM CLIENTES
        WHERE ATIVO = 'S'
      `;

      const clientes = await this.query(sql);
      
      console.log(`✅ ${clientes.length} clientes sincronizados do CaptarePro`);
      
      return {
        success: true,
        message: `${clientes.length} clientes sincronizados com sucesso`,
        recordsProcessed: clientes.length,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao sincronizar clientes: ${error.message}`,
        errors: [error.message],
      };
    }
  }

  /**
   * Sincronizar produtos do CaptarePro
   */
  async syncProdutos(): Promise<SyncResult> {
    try {
      const sql = `
        SELECT 
          CODPRO as id,
          NOMPRO as nome,
          DESPRO as descricao,
          VLRPRO as preco,
          QTDEST as estoque,
          UNIPRO as unidade,
          CATPRO as categoria,
          DTACAD as data_cadastro
        FROM PRODUTOS
        WHERE ATIVO = 'S'
      `;

      const produtos = await this.query(sql);
      
      console.log(`✅ ${produtos.length} produtos sincronizados do CaptarePro`);
      
      return {
        success: true,
        message: `${produtos.length} produtos sincronizados com sucesso`,
        recordsProcessed: produtos.length,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao sincronizar produtos: ${error.message}`,
        errors: [error.message],
      };
    }
  }

  /**
   * Sincronizar pedidos do CaptarePro
   */
  async syncPedidos(): Promise<SyncResult> {
    try {
      const sql = `
        SELECT 
          CODPED as id,
          CODCLI as cliente_id,
          DATPED as data_pedido,
          VLRTOT as valor_total,
          STOPED as status,
          DTAENT as data_entrega,
          OBSPRO as observacoes
        FROM PEDIDOS
        WHERE DATPED >= CURRENT_DATE - 30
      `;

      const pedidos = await this.query(sql);
      
      console.log(`✅ ${pedidos.length} pedidos sincronizados do CaptarePro`);
      
      return {
        success: true,
        message: `${pedidos.length} pedidos sincronizados com sucesso`,
        recordsProcessed: pedidos.length,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao sincronizar pedidos: ${error.message}`,
        errors: [error.message],
      };
    }
  }

  /**
   * Sincronizar estoque do CaptarePro
   */
  async syncEstoque(): Promise<SyncResult> {
    try {
      const sql = `
        SELECT 
          CODPRO as produto_id,
          QTDEST as quantidade,
          QTDMIN as quantidade_minima,
          DTAATU as data_atualizacao
        FROM ESTOQUE
      `;

      const estoque = await this.query(sql);
      
      console.log(`✅ ${estoque.length} registros de estoque sincronizados`);
      
      return {
        success: true,
        message: `${estoque.length} registros de estoque sincronizados com sucesso`,
        recordsProcessed: estoque.length,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao sincronizar estoque: ${error.message}`,
        errors: [error.message],
      };
    }
  }

  /**
   * Sincronizar financeiro do CaptarePro
   */
  async syncFinanceiro(): Promise<SyncResult> {
    try {
      const sql = `
        SELECT 
          CODFIN as id,
          CODPED as pedido_id,
          VLRFIN as valor,
          DTAVEN as data_vencimento,
          DTAPAG as data_pagamento,
          STAFIN as status,
          OBSFIN as observacoes
        FROM FINANCEIRO
        WHERE DTAVEN >= CURRENT_DATE - 90
      `;

      const financeiro = await this.query(sql);
      
      console.log(`✅ ${financeiro.length} registros financeiros sincronizados`);
      
      return {
        success: true,
        message: `${financeiro.length} registros financeiros sincronizados com sucesso`,
        recordsProcessed: financeiro.length,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao sincronizar financeiro: ${error.message}`,
        errors: [error.message],
      };
    }
  }

  /**
   * Sincronizar todos os dados
   */
  async syncAll(): Promise<SyncResult> {
    try {
      await this.connect();

      const results = {
        clientes: await this.syncClientes(),
        produtos: await this.syncProdutos(),
        pedidos: await this.syncPedidos(),
        estoque: await this.syncEstoque(),
        financeiro: await this.syncFinanceiro(),
      };

      await this.disconnect();

      const totalRecords = Object.values(results).reduce(
        (sum, result) => sum + (result.recordsProcessed || 0),
        0
      );

      return {
        success: true,
        message: `Sincronização completa: ${totalRecords} registros processados`,
        recordsProcessed: totalRecords,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro na sincronização completa: ${error.message}`,
        errors: [error.message],
      };
    }
  }
}

/**
 * Factory para criar instância de conexão Firebird
 */
export function createFirebirdConnection(): FirebirdConnection {
  const config: FirebirdConfig = {
    host: process.env.FIREBIRD_HOST || 'localhost',
    port: parseInt(process.env.FIREBIRD_PORT || '3050'),
    database: process.env.FIREBIRD_DATABASE || '/opt/firebird/data/captarepro.fdb',
    user: process.env.FIREBIRD_USER || 'sysdba',
    password: process.env.FIREBIRD_PASSWORD || 'masterkey',
  };

  return new FirebirdConnection(config);
}

export default FirebirdConnection;
