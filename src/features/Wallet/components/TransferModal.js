import React, { Component } from "react";
import { Modal, Popconfirm, Input, Button, Checkbox } from 'antd';
import { formatNumber } from "utils/helpers/steemitHelpers";

const MIN_WITHDRAW = 1000.00;
const MAX_WITHDRAW = 10000.00;

export default class TransferModal extends Component {


  state = {
    message: null,
    transferAmount: MIN_WITHDRAW,
    agreement: false,
  }

  componentDidMount() {
    if (this.props.walletProps.balance < MIN_WITHDRAW) {
      this.setState({ message: `You have to have at leat ${formatNumber(MIN_WITHDRAW, '0,0')} HUNT to transfer.` })
    }
  }

  handleWithdrawalAmountChanged = (amount) => {
    if (!/^\d*\.?\d*$/.test(amount)) {
      return false;
    }
    this.setState({ transferAmount: amount, message: this.getErrorMessage(amount) });
  }

  isValidAmount = (amount) => {
    return this.getErrorMessage(amount) === null;
  }

  getErrorMessage = (amount) => {
    if (amount > parseFloat(this.props.walletProps.balance)) {
      return "You typed more tokens than your balance.";
    } else if (amount < MIN_WITHDRAW) {
      return `You have to transfer at leat ${formatNumber(MIN_WITHDRAW, '0,0')} HUNT.`;
    } else if (amount > MAX_WITHDRAW) {
      return `You cannot transfer more than ${formatNumber(MAX_WITHDRAW, '0,0')} HUNT.`;
    } else {
      return null;
    }
  }

  render() {
    const { balance, isLoading, ethAddress } = this.props.walletProps;

    return (
      <Modal
        title="Transfer to External Wallet"
        visible={this.props.modalVisible}
        onCancel={this.props.modalToggle}
        className={"transfer-modal"}
        footer={[
          <Popconfirm key="submit" placement="topRight" title={
            <div>
              Are you sure you want to transfer {formatNumber(this.state.transferAmount)} HUNT tokens to your external ETH wallet below?<br/>
              {(ethAddress || 'ERROR: You did not register your ETH address')}
            </div>
          } onConfirm={() => this.props.handleTransfer(this.state.transferAmount)} okText="Yes" cancelText="No">
            <Button type="primary"
              loading={isLoading}
              disabled={!this.isValidAmount(this.state.transferAmount) || !this.state.agreement}>
              Submit
            </Button>
          </Popconfirm>,
        ]}
      >
        <div className="sans small">Steemhunt Wallet Balance</div>
        <h1 className="sans pink hunt-balance">{formatNumber(balance)} <span className="hunt-text">HUNT</span></h1>
        <div className="sans small subtitle">
          Steemhunt is paying the gas price for the Ethereum transactions. To prevent too much cost, we set the transaction limits as follows:
        </div>
        <ul>
          <li>You can only transfer once a day</li>
          <li>You can only transfer to your registered external wallet</li>
          <li>Minimum withdrawal: {formatNumber(MIN_WITHDRAW, '0,0')} HUNT / day</li>
          <li>Maximum withdrawal: {formatNumber(MAX_WITHDRAW, '0,0')} HUNT / day</li>
          
        </ul>
        <div className="sans small subtitle">Registered Wallet Address</div>
        <Input placeholder={ethAddress} disabled />
        <div className="sans small subtitle">Amount</div>
        <div className={this.state.message ? 'has-error' : ''}>
          <Input
            placeholder={`Min ${formatNumber(MIN_WITHDRAW)} HUNT`}
            value={this.state.transferAmount}
            suffix={<span className="fake-link" onClick={() => this.handleWithdrawalAmountChanged(balance > MAX_WITHDRAW ? MAX_WITHDRAW : balance)}>Max</span>}
            onChange={(e) => this.handleWithdrawalAmountChanged(e.target.value)}
          />
          {this.state.message && <div className="ant-form-explain top-margin">{this.state.message}</div>}
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
