// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// Third-part
import { message } from 'antd';
import _ from 'lodash';

// mine
import Basic from './SideBarAdsForm/Basic';
import Carousel from './SideBarAdsForm/Carousel';
import ResourceModal from '../../ResourceModal';
import config from './config';
import event from '../../../utils/event';
// import style from './style.M.less';

// @CSSModule(style)
export default class SidebarModal extends Component {
  static propTypes = {
    styleConfig: PropTypes.object,
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
  }

  static defaultProps = {
    styleConfig: {
      SideBarAds: {
        style: config.map(item => item.style),
      },
    },
  }


  constructor(props) {
    super();
    const { data } = props;
    const modelConfig = {
      __t: 'SideBarAds',
      style: 0,
      title: '',
      icon: '',
      cover: [
        { fileType: 'image', src: '' },
      ],
      coverLink: '',
      coverLinkMonitorUrl: [],
      themeColor: 0,
      textTitle: '',
      textDescription: '',
      btn: {
        content: '',
        link: '',
      },
      needPraised: true,
      linkBtnMonitorUrl: [],
    };

    this.state = {
      loading: false,
      data: _.defaults(data, modelConfig),
    };
  }

  /**
   * skin change
   * @param index
   */
  onSkinChange = (index) => {
    const { styleConfig } = this.props;
    const { data } = this.state;
    const styleList = _(config).filter((item) => {
      return _(styleConfig.SideBarAds.style).indexOf(item.style) >= 0;
    }).value();
    data.style = styleList[index].style;
    this.setState({ data });
  }

  onOk = () => {
    const { onOk } = this.props;
    event.$emit('validateFields', (values, monitorUrl) => {
      const sortedData = _(values)
        .mapValues((item, key) => {
          if (key === 'cover') {
            return _(item).map((el) => {
              return { fileType: 'image', src: el };
            }).value();
          }
          return item;
        })
        .value();
      _(monitorUrl).forEach((item, key) => {
        const monitor = _(item)
          .map(el => ({
            [el[0]]: {
              [el[1]]: el[2],
            },
            admaster: el[3],
          }))
          .value();
        _.set(sortedData, key, monitor);
      });
      onOk({
        ...this.state.data,
        ...sortedData,
      });
    });
  }

  render() {
    const { onCancel, isCreated, disabled, styleConfig } = this.props;
    const { loading, data } = this.state;
    const { onSkinChange, onOk } = this;

    const styleList = _(config).filter((item) => {
      return _(styleConfig.SideBarAds.style).indexOf(item.style) >= 0;
    }).value();

    const modalProps = {
      disabled,
      isCreated,
      title: _.get(_.find(styleList, item => item.style === data.style), 'type'),
      skinTypeList: styleList,
      skin: _.findIndex(styleList, item => item.style === data.style),
      onSkinChange,
      onCancel,
      onOk,
      loading,
    };

    // let imagesMinLength = 0, imagesMaxLength = 1
    // if (data.style === 0) {
    //   imagesMinLength = 1
    //   imagesMaxLength = 1
    // } else if (data.style === 1) {
    //   imagesMinLength = 1
    //   imagesMaxLength = 5
    // }

    return (
      <ResourceModal
        {...modalProps}
      >
        {
          data.style === 0
          && <Basic
            {...this.props}
            data={data}
          />
        }
        {
          data.style === 1
          && <Carousel
            {...this.props}
            data={data}
          />
        }
        {/* <div className={`${prefix}`}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="侧边栏名称"
            >
              <Input
                style={{ width: '320px' }}
                value={data.title}
                placeholder={config.title.placeholder}
                onChange={e => {
                  __setFields(null, 'title', e.target.value)
                }}
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="icon"
            >
              <div style={{ width: '200px', height: `${200 / config.icon.cropConfig.cropOptions.aspect}px` }}>
                <ImageUploader
                  {...config.icon.cropConfig}
                  fileURL={data.icon}
                  onUploadChange={value => {
                    __setFields(null, 'icon', value)
                  }}
                />
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="图片"
            >
              <Row>
                <ImageGroup
                  images={data.cover.map(item => item.src)}
                  onChange={value => __setFields(null, 'cover', value.map(item => {
                    return {
                      fileType: 'image',
                      src: item
                    }
                  }))}
                  cropConfig={{
                    crop: true,
                    disabled: false,
                    cropOptions: {
                      aspect: 1,
                    },
                  }}
                  imageStyle={{
                    width: '200px',
                    height: '200px',
                  }}
                  minLength={imagesMinLength}
                  maxLength={imagesMaxLength}
                />

              </Row>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="图片外链"
            >
              <Input
                style={{ width: '320px' }}
                value={data.coverLink}
                placeholder={config.coverLink.placeholder}
                onChange={e => __setFields(null, 'coverLink', e.target.value) }
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="添加监测代码"
            >
              <MonitorUrl
                isCreateBall={isCreateBall}
                monitorUrlList={data.coverLinkMonitorUrl}
                onChange={data => setMonitorUrl(data, 'coverLinkMonitorUrl') }
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="主题色"
            >
              <ColorSelect
                colors={colorSelectList}
                current={data.themeColor}
                onChange={ value => __setFields(null, 'themeColor', value)}
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标题文字"
            >
              <Input
                style={{ width: '320px' }}
                value={data.textTitle}
                placeholder={config.textTitle.placeholder}
                onChange={e => __setFields(null, 'textTitle', e.target.value) }
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="说明文字"
            >
              <Input
                style={{ width: '320px' }}
                value={data.textDescription}
                placeholder={config.textDescription.placeholder}
                onChange={e => __setFields(null, 'textDescription', e.target.value) }
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="按钮文字"
            >
              <Input
                style={{ width: '320px' }}
                value={data.btn.content}
                placeholder={config.btn.properties.content.placeholder}
                onChange={e => __setFields('btn', 'content', e.target.value) }
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="按钮外链"
            >
              <Input
                style={{ width: '320px' }}
                value={data.btn.link}
                placeholder={config.btn.properties.link.placeholder}
                onChange={e => __setFields('btn', 'link', e.target.value) }
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="添加监测代码"
            >
              <MonitorUrl
                isCreateBall={isCreateBall}
                monitorUrlList={data.linkBtnMonitorUrl}
                onChange={data => setMonitorUrl(data, 'linkBtnMonitorUrl') }
              />
            </FormItem>
            <Row>
              <Col span={18} offset={6}>
                <Checkbox
                  checked={data.needPraised}
                  onChange={e => __setFields(null, 'needPraised', e.target.checked)}
                >
                  是否需要点赞功能
                </Checkbox>
              </Col>
            </Row>
          </Form>

        </div>*/}
      </ResourceModal>
    );
  }
}
