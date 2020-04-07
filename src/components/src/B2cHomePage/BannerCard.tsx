import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './b2c.home.page.less';
let Config: IEpConfig | any = {};

interface BannerCardProps {
  numberOfPurchases: number;
}

interface BannerCardState {
  isLoggedInUser: boolean;
  numberOfPurchases: any;
  isLoading: boolean;
}

class BannerCard extends Component<BannerCardProps, BannerCardState> {
  static defaultProps = {
    numberOfPurchases: 0
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;
  }

  redirectToPurchaseHistory() {
    window.location.href = '/account/purchase-history';
  }

  render() {
    const { numberOfPurchases } = this.props;
    return (
      <>
        {numberOfPurchases === 1 && (
          <p className="banner-text-description">
            You have {numberOfPurchases} order in process.
          </p>
        )}
        {numberOfPurchases === 0 && (
          <p className="banner-text-description">
            You have no orders in process.
          </p>
        )}
        {numberOfPurchases > 1 && (
          <p className="banner-text-description">
            You have {numberOfPurchases} orders in process.
          </p>
        )}
        <button
          onClick={this.redirectToPurchaseHistory}
          type="button"
          className="main-banner-btn"
        >
          View my orders
        </button>
      </>
    );
  }
}

export default BannerCard;
