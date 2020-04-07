/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

// TODO add redirects to the prescription page -

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';
import IndiRecommendationsDisplayMain from '../IndiRecommendations/indirecommendations.main';
import ImageContainer from '../ImageContainer/image.container';

import AppModalLoginMain from '../AppModalLogin/appmodallogin.main';

import BannerCard from './BannerCard';
import { cortexFetch } from '../utils/Cortex';
import { login } from '../utils/AuthService';

import './b2c.home.page.less';

import bannerImage1 from '../../../images/site-images/humana-home-1.png';
import bannerImage2 from '../../../images/site-images/humana-home-2.png';
import bannerImage3 from '../../../images/site-images/b2c-banner-3.png';
import productImage1 from '../../../images/site-images/Humana_Fitness.jpg';
import productImage2 from '../../../images/site-images/Humana-Phone.JPG';
import productImage3 from '../../../images/site-images/Humana_Coronavirus.jpg';
import productImage4 from '../../../images/site-images/b2c-product-4.png';
import productImage5 from '../../../images/site-images/b2c-product-5.png';
import productImage6 from '../../../images/site-images/b2c-product-6.png';
import productImage7 from '../../../images/site-images/b2c-product-7.png';
import { number } from 'prop-types';

let Config: IEpConfig | any = {};

const bannerFileName1 = 'humana-home-1.png';
const bannerFileName2 = 'humana-home-1.png';
const bannerFileName3 = 'b2c-banner-3.png';
const productFileName1 = 'Humana_Fitness.jpg';
const productFileName2 = 'Humana-Phone.JPG';
const productFileName3 = 'Humana_Coronavirus.jpg';
const productFileName4 = 'b2c-product-4.png';
const productFileName5 = 'b2c-product-5.png';
const productFileName6 = 'b2c-product-6.png';
const productFileName7 = 'b2c-product-7.png';

interface B2CProps {
  locationPathName?: string;
  redirectToMainPage: (...args: any[]) => any;
}

interface B2CState {
  isLoggedInUser: boolean;
  numberOfPurchases: any;
  isLoading: boolean;
  openModal: boolean;
  loginUrlAddress: string;
  oidcParameters: any;
}

const zoomArray = [
  'defaultprofile:purchases',
  'defaultprofile:purchases:element'
];
class B2CHomePage extends Component<B2CProps, B2CState> {
  static defaultProps = {
    locationPathName: '',
    redirectToMainPage: () => {}
  };

  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      isLoggedInUser:
        localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) ===
        'REGISTERED',
      isLoading: false,
      numberOfPurchases: null,
      openModal: false,
      loginUrlAddress: '',
      oidcParameters: {}
    };
  }

  async componentDidMount() {
    await this.fetchPurchaseData();
  }

  handleModalOpen = () => {
    this.setState({
      openModal: true
    });
  };

  handleModalClose = () => {
    this.setState({
      openModal: false
    });
  };

  onLogin = () => {
    window.location.href = '/';
  };

  fetchPurchaseData = async () => {
    this.setState({ isLoading: true });
    try {
      await login();
      const res = await cortexFetch(`/?zoom=${zoomArray.sort().join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(
            `${Config.cortexApi.scope}_oAuthToken`
          )
        }
      });

      const profileData = await res.json();
      const numberOfPurchases =
        profileData._defaultprofile[0]._purchases[0]._element.length;

      this.setState({ numberOfPurchases: numberOfPurchases, isLoading: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  };

  handleRegisterRequest = () => {
    window.location.href = '/registration';
  };

  handleNewPrescriptionRequest = () => {
    window.location.href = '/account/requisition-lists';
  };

  render() {
    // Set the language-specific configuration for indi integration
    Config.indi.brandAmbassador.title = intl.get('indi-brand-ambassador-title');
    Config.indi.brandAmbassador.description = intl.get(
      'indi-brand-ambassador-description'
    );
    Config.indi.brandAmbassador.submit_button_text = intl.get(
      'indi-brand-ambassador-submit-button-text'
    );

    const appModalLoginLinks = {
      registration: ''
    };

    const {
      isLoggedInUser,
      numberOfPurchases,
      isLoading,
      openModal,
      oidcParameters
    } = this.state;

    return (
      <div className="home-page-b2c">
        <div className={`app-login-component`}>
          <AppModalLoginMain
            key="app-modal-login-main"
            oidcParameters={oidcParameters}
            handleModalClose={this.handleModalClose}
            openModal={openModal}
            onLogin={this.onLogin}
            appModalLoginLinks={appModalLoginLinks}
            showForgotPasswordLink={false}
          />
        </div>
        <section className="main-banner">
          <ImageContainer
            className="main-banner-image"
            fileName={bannerFileName1}
            imgUrl={bannerImage1}
          />
          <div className="main-banner-title-wrap">
            <div className="container">
              {isLoggedInUser && (
                <React.Fragment>
                  <h2 className="goods-heading">
                    {intl.get('b2c-main-banner-header-logged-in')}
                  </h2>
                  <div className="home-banner-card-container">
                    {
                      <div className="main-banner-card">
                        <p className="banner-text-header">
                          Need a new prescription?
                        </p>
                        <p className="banner-text-description">
                          Get started with Humana Pharmacy.
                        </p>
                        <button
                          onClick={this.handleNewPrescriptionRequest}
                          type="button"
                          className="main-banner-btn"
                        >
                          Start a new presription
                        </button>
                      </div>
                    }
                    <div className="main-banner-card">
                      <p className="banner-text-header">
                        Check your order status
                      </p>
                      {isLoading ? (
                        <div className="loader" />
                      ) : (
                        <BannerCard numberOfPurchases={numberOfPurchases} />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              )}
              <div className="login-container"></div>
              {!isLoggedInUser && (
                <React.Fragment>
                  <h2 className="goods-heading">
                    {intl.get('b2c-main-banner-heading')}
                  </h2>
                  <div className="main-banner-txt">
                    <p className="goods-description">
                      {intl.get('b2c-main-banner-txt')}
                    </p>
                  </div>
                  <div className="btn-wrap">
                    <button
                      type="button"
                      className="ep-btn primary sign-in-btn"
                      onClick={this.handleModalOpen}
                    >
                      {intl.get('b2c-main-banner-btn-text')}
                    </button>
                    <button
                      type="button"
                      className="ep-btn primary register-btn"
                      onClick={this.handleRegisterRequest}
                    >
                      {intl.get('register-new-account')}
                    </button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </section>

        <IndiRecommendationsDisplayMain
          render={['carousel', 'brand']}
          configuration={Config.indi}
        />

        <section className="goods-section-1">
          <div className="container">
            <div className="main-goods ">
              <ul className="main-goods__grid">
                <li className="main-goods__cell">
                  <div className="main-goods-wrap">
                    <div className="goods-info">
                      <h5 className="goods-title-small">
                        {intl.get('b2c-product1-label')}
                      </h5>
                      <h3 className="goods-title">
                        {intl.get('b2c-product1-heading')}
                      </h3>
                      <div className="btn-wrap">
                        <button
                          type="button"
                          className="ep-btn primary learn-more-btn"
                        >
                          {intl.get('learn-more')}
                        </button>
                      </div>
                    </div>
                    <ImageContainer
                      className="main-goods-image"
                      fileName={productFileName1}
                      imgUrl={productImage1}
                    />
                  </div>
                </li>
                <li className="main-goods__cell">
                  <div className="main-goods-wrap">
                    <div className="goods-info">
                      <h5 className="goods-title-small">
                        {intl.get('b2c-product2-label')}
                      </h5>
                      <h3 className="goods-title">
                        {intl.get('b2c-product2-heading')}
                      </h3>
                      <p className="goods-description">
                        {intl.get('b2c-product2-description')}
                      </p>
                    </div>
                    <ImageContainer
                      className="main-goods-image"
                      fileName={productFileName2}
                      imgUrl={productImage2}
                    />
                  </div>
                </li>
                <li className="main-goods__cell">
                  <div className="main-goods-wrap">
                    <div className="goods-info">
                      <h5 className="goods-title-small">
                        {intl.get('b2c-product3-label')}
                      </h5>
                      <h3 className="goods-title">
                        {intl.get('b2c-product3-heading')}
                      </h3>
                      <p className="goods-description">
                        {intl.get('b2c-product3-description')}
                      </p>
                      <button
                        type="button"
                        className="ep-btn primary learn-more-btn"
                      >
                        {intl.get('b2c-product3-label')}
                      </button>
                    </div>
                    <ImageContainer
                      className="main-goods-image"
                      fileName={productFileName3}
                      imgUrl={productImage3}
                    />
                  </div>
                </li>
                <li className="main-goods__cell">
                  <div className="main-goods-wrap">
                    <div className="goods-info">
                      <h5 className="goods-title-small">
                        {intl.get('b2c-product4-label')}
                      </h5>
                      <h3 className="goods-title">
                        {intl.get('b2c-product4-heading')}
                      </h3>
                      <p className="goods-description">
                        {intl.get('b2c-product4-description')}
                      </p>
                    </div>
                    <ImageContainer
                      className="main-goods-image"
                      fileName={productFileName4}
                      imgUrl={productImage4}
                    />
                  </div>
                </li>
                <li className="main-goods__cell">
                  <div className="main-goods-wrap">
                    <div className="goods-info">
                      <h5 className="goods-title-small">
                        {intl.get('b2c-product5-label')}
                      </h5>
                      <h3 className="goods-title">
                        {intl.get('b2c-product5-heading')}
                      </h3>
                    </div>
                    <ImageContainer
                      className="main-goods-image"
                      fileName={productFileName5}
                      imgUrl={productImage5}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="main-banner banner-section-2">
          <ImageContainer
            className="main-banner-image"
            fileName={bannerFileName2}
            imgUrl={bannerImage2}
          />
          <div className="main-banner-title-wrap">
            <div className="container">
              <h2 className="goods-heading">
                {intl.get('b2c-main-banner-heading2')}
              </h2>
              <div className="main-banner-txt">
                <p className="goods-description">
                  {intl.get('b2c-main-banner-txt2')}
                </p>
                <div className="btn-wrap">
                  <button
                    type="button"
                    className="ep-btn primary learn-more-btn"
                  >
                    {intl.get('learn-more')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default B2CHomePage;
