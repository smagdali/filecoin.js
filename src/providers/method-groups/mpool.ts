import { Connector } from '../../connectors/Connector';
import { Cid, Message, MpoolConfig, MpoolUpdate, SignedMessage, TipSetKey } from '../Types';
import { WsJsonRpcConnector } from '../../index';

/**
 * The Mpool methods are for interacting with the message pool. The message pool manages all incoming and outgoing 'messages' going over the network.
 */
export class JsonRpcMPoolMethodGroup {
  private conn: Connector;

  constructor(conn: Connector) {
    this.conn = conn;
  }

  /**
   * returns (a copy of) the current mpool config
   */
  public async getMpoolConfig(): Promise<MpoolConfig> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolGetConfig', params: [] });
    return ret;
  }

  /**
   * sets the mpool config to (a copy of) the supplied config
   * @param config
   */
  public async setMpoolConfig(config: MpoolConfig): Promise<MpoolConfig> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolSetConfig', params: [config] });
    return ret;
  }

  /**
   * clears pending messages from the mpool
   */
  public async clear(): Promise<any> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolClear', params: [true] });
    return ret;
  }

  /**
   * get all mpool messages
   * @param tipSetKey
   */
  public async getMpoolPending(tipSetKey: TipSetKey): Promise<[SignedMessage]> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolPending', params: [tipSetKey] });
    return ret;
  }

  /**
   * returns a list of pending messages for inclusion in the next block
   * @param tipSetKey
   * @param ticketQuality
   */
  public async select(tipSetKey: TipSetKey, ticketQuality: number): Promise<[SignedMessage]> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolSelect', params: [tipSetKey, ticketQuality] });
    return ret;
  }

  /**
   * returns a list of pending messages for inclusion in the next block
   * @param tipSetKey
   * @param ticketQuality
   */
  public async sub(cb: (data: MpoolUpdate) => void) {
    if (this.conn instanceof WsJsonRpcConnector) {
      const subscriptionId = await this.conn.request({
        method: 'Filecoin.MpoolSub',
      });
      this.conn.on(subscriptionId, cb);
    }
  }

  /**
   * pushes a signed message to mempool from untrusted sources.
   * @param message
   */
  public async pushUntrusted(message: SignedMessage): Promise<Cid> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolPushUntrusted', params: [message] });
    return ret;
  }

  /**
   * batch pushes a signed message to mempool.
   * @param messages
   */
  public async batchPush(messages: SignedMessage[]): Promise<Cid[]> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolBatchPush', params: [messages] });
    return ret;
  }

  /**
   * batch pushes a signed message to mempool from untrusted sources
   * @param messages
   */
  public async batchPushUntrusted(messages: SignedMessage[]): Promise<Cid[]> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolBatchPushUntrusted', params: [messages] });
    return ret;
  }

  /**
   * batch pushes a unsigned message to mempool
   * @param messages
   */
  public async batchPushMessage(messages: Message[]): Promise<SignedMessage[]> {
    const ret = await this.conn.request({ method: 'Filecoin.MpoolBatchPushMessage', params: [messages] });
    return ret;
  }
}
