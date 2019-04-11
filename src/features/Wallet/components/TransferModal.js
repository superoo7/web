import React, { Component } from "react";
import { Modal, Popconfirm, Input, Button, Checkbox } from 'antd';
import { formatNumber } from "utils/helpers/steemitHelpers";

const MIN_WITHDRAW = 1000.00;
const MAX_WITHDRAW = 10000.00;

export default class TransferModal extends Component {
  state = {
    availableBalance: 0,
    message: null,
    transferAmount: MIN_WITHDRAW,
    agreement: false,
  };

  componentDidMount() {
    const { balances } = this.props.walletProps;
    let availableBalance = parseFloat(balances.hunt_balance) - parseFloat(balances.locked_hunt);
    availableBalance = Math.floor(availableBalance * 100) / 100;
    this.setState({ availableBalance });

    if (availableBalance < MIN_WITHDRAW) {
      this.setState({ message: `You have to have at leat ${formatNumber(MIN_WITHDRAW, '0,0')} HUNT to transfer.` })
    }
  }

  handleWithdrawalAmountChanged = (amount) => {
    if (!/^\d*\.?\d*$/.test(amount)) {
      return false;
    }
    this.setState({ transferAmount: amount, message: this.getErrorMessage(amount) });
  };

  isValidAmount = (amount) => {
    return this.getErrorMessage(amount) === null;
  };

  getErrorMessage = (amount) => {
    if (amount > this.state.availableBalance) {
      return "You typed more tokens than your available balance.";
    } else if (amount < MIN_WITHDRAW) {
      return `You have to transfer at leat ${formatNumber(MIN_WITHDRAW, '0,0')} HUNT.`;
    } else if (amount > MAX_WITHDRAW) {
      return `You cannot transfer more than ${formatNumber(MAX_WITHDRAW, '0,0')} HUNT.`;
    } else {
      return null;
    }
  };

  render() {
    const { isLoading, ethAddress } = this.props.walletProps;
    const { availableBalance, transferAmount, agreement, message } = this.state;

    return (
      <Modal
        title="Transfer to External Wallet"
        visible={this.props.modalVisible}
        onCancel={this.props.modalToggle}
        className={"transfer-modal"}
        footer={[
          <Popconfirm key="submit" placement="topRight" title={
            <div>
              Are you sure you want to transfer {formatNumber(transferAmount)} HUNT tokens to your external ETH wallet below?<br/>
              {(ethAddress || 'ERROR: You did not register your ETH address')}
            </div>
          } onConfirm={() => this.props.handleTransfer(transferAmount)} okText="Yes" cancelText="No">
            <Button type="primary"
              loading={isLoading}
              disabled={!this.isValidAmount(transferAmount) || !agreement}>
              Submit
            </Button>
          </Popconfirm>,
        ]}
      >
        <div className="sans small">Available Balance</div>
        <h1 className="sans pink hunt-balance">{formatNumber(availableBalance)} <span className="hunt-text">HUNT</span></h1>
        <div className="sans small subtitle">
          Steemhunt is paying the gas price for the Ethereum transactions. To prevent too much cost, we set the transaction limits as follows:
        </div>
        <ul>
          <li>You can only transfer to your registered external wallet once per 24 hours</li>
          <li>Minimum withdrawal: {formatNumber(MIN_WITHDRAW, '0,0')} HUNT / day</li>
          <li>Maximum withdrawal: {formatNumber(MAX_WITHDRAW, '0,0')} HUNT / day</li>

        </ul>
        <div className="sans small subtitle">Registered Wallet Address</div>
        <Input placeholder={ethAddress} disabled />
        <div className="sans small subtitle">Amount</div>
        <div className={message ? 'has-error' : ''}>
          <Input
            placeholder={`Min ${formatNumber(MIN_WITHDRAW)} HUNT`}
            value={transferAmount}
            suffix={<span className="fake-link" onClick={() => this.handleWithdrawalAmountChanged(availableBalance > MAX_WITHDRAW ? MAX_WITHDRAW : availableBalance)}>Max</span>}
            onChange={(e) => this.handleWithdrawalAmountChanged(e.target.value)}
          />
          {message && <div className="ant-form-explain top-margin">{message}</div>}
        </div>
        <div className="top-margin">
          <p className="agreement-text subtitle">
            Please check the address carefully before requesting a transfer.
            Transfer requests cannot be canceled.
            Steemhunt is not liable for any losses incurred as a result of the wrong information.
            We will suspend suspicious transactions such as identity theft, fraud, abuse, or hacking.
            Steemhunt is not responsible for damage caused by illegal transactions of its users.
          </p>
          <Checkbox onChange={(e) => this.setState({ agreement: e.target.checked })}>I have read and consent to the following agreement.</Checkbox>
        </div>
      </Modal>
    )
  }
}
