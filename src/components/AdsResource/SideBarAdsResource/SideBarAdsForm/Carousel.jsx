// official
import React, { Component, PropTypes } from 'react';
import CSSModule from 'react-css-modules';

// 3rd-part
import { Form, Row, Col, Input, Icon, Button, message, Radio, Select, Checkbox, InputNumber } from 'antd';
import _ from 'lodash';

// self
import MonitorUrl from '../../../MonitorUrl';

import ImageUploadCustomed from '../../../ImageUploadCustomed';
import ImageGroup from '../../../ImageGroup';
import ColorSelect from '../../../ColorSelect';
import utils from '../../../../utils';
import style from '../style.M.less';

const { event, reg, decorators: { formCreate } } = utils;


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@formCreate()
@CSSModule(style)
export default class Carousel extends Component {
  constructor(props) {
    super();
    this.state = {
      data: _.cloneDeep(props.data),
    };
  }

  componentDidMount() {
    const { form } = this.props;
    event.$on('validateFields', (callback) => {
      // before get monitorUrl value, clear array
      let monitorUrl = {};
      let monitorErr = null;
      event.$emit('validateMonitorUrl', (data) => {
        if (data instanceof Error) {
          monitorErr = data;
        }
        monitorUrl = {
          ...monitorUrl,
          ...data,
        };
      });

      form.validateFields((err, values) => {
        if (err) {
          return false;
        }

        if (monitorErr) return false;

        // 检查轮播样式

        if (!form.getFieldValue('cover').every(item => item)) {
          message.error('图片不能为空!');
          return false;
        }
        callback(values, monitorUrl);
      });
    });
  }


  componentWillUnmount() {
    event.$clear('validateFields');
  }

  setImageGroupField = (value) => {
    const { form } = this.props;
    form.setFieldsValue({
      cover: value.map(item => item.value),
    });
  }

  render() {
    const { form, disabled } = this.props;
    const { data } = this.state;
    const { setImageGroupField } = this;
    const prefix = 'sidebar-ads-resource';
    const colorSelectList = ['#4a90ae', '#f5a623', '#46b3b7', '#ff3b6b'];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      required: true,
    };

    form.getFieldDecorator('cover', {
      initialValue: data.cover.map(item => item.src),
    });

    return (
      <div className={`${prefix}`}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="侧边栏名称"
          >
            {
              form.getFieldDecorator('title', {
                initialValue: data.title,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '请输入侧边栏名称',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="ICON"
          >
            <div style={{ width: '200px', height: '200px' }}>
              {
                form.getFieldDecorator('icon', {
                  valuePropName: 'fileURL',
                  trigger: 'onUploadChange',
                  initialValue: data.icon,
                  rules: [{
                    type: 'string',
                    required: true,
                    message: '请上传ICON',
                  }],
                })(<ImageUploadCustomed
                  axiosComtomed={this.props.axiosComtomed}
                  staticVideoJJAPI={this.props.staticVideoJJAPI}
                  qiniuUploadAPI={this.props.qiniuUploadAPI}
                  disabled={disabled}
                  {...{
                    crop: true,
                    cropOptions: {
                      aspect: 1,
                    },
                  }}
                />)
              }
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图片"
          >
            <Row>
              <ImageGroup
                images={data.cover.map(item => item.src)}
                onChange={setImageGroupField}
                // onChange={value => __setFields(null, 'cover', value.map(item => {
                //  return {
                //    fileType: 'image',
                //    src: item
                //  }
                // }))}
                axiosComtomed={this.props.axiosComtomed}
                staticVideoJJAPI={this.props.staticVideoJJAPI}
                qiniuUploadAPI={this.props.qiniuUploadAPI}
                disabled={disabled}
                cropConfig={{
                  crop: true,
                  cropOptions: {
                    aspect: 1,
                  },
                }}
                imageStyle={{
                  width: '200px',
                  height: '200px',
                }}
                minLength={1}
                maxLength={5}
              />

            </Row>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图片外链"
          >
            {
              form.getFieldDecorator('coverLink', {
                initialValue: data.coverLink,
                rules: [{
                  type: 'string',
                  required: true,
                  pattern: reg.httpRegWithProtocol,
                  message: '请输入正确的图片外链',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入图片跳转的地址"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="添加监测代码"
          >
            <MonitorUrl
              disabled={disabled}
              ctx={'coverLinkMonitorUrl'}
              monitorUrlList={data.coverLinkMonitorUrl}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="主题色"
          >
            {
              form.getFieldDecorator('themeColor', {
                valuePropName: 'current',
                initialValue: data.themeColor,
                rules: [{
                  type: 'number',
                  required: true,
                }],
              })(<ColorSelect
                disabled={disabled}
                colors={colorSelectList}
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标题文字"
          >
            {
              form.getFieldDecorator('textTitle', {
                initialValue: data.textTitle,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '标题文字不能为空',
                }, {
                  max: 10,
                  message: '标题文字不能大于10个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入标题文字"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="说明文字"
          >
            {
              form.getFieldDecorator('textDescription', {
                initialValue: data.textDescription,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '说明文字不能为空',
                }, {
                  max: 24,
                  message: '说明文字不能大于24个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入说明文字"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="按钮文字"
          >
            {
              form.getFieldDecorator('btn.content', {
                initialValue: data.btn.content,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '按钮文字不能为空',
                }, {
                  max: 4,
                  message: '按钮文字不能大于4个字符',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入按钮文字"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="按钮外链"
          >
            {
              form.getFieldDecorator('btn.link', {
                initialValue: data.btn.link,
                rules: [{
                  type: 'string',
                  required: true,
                  message: '按钮外链不能为空',
                }, {
                  pattern: reg.httpRegWithProtocol,
                  message: '请输入正确的按钮外链',
                }],
              })(<Input
                disabled={disabled}
                style={{ width: '320px' }}
                placeholder="请输入按钮文字"
              />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="监测代码"
          >
            <MonitorUrl
              disabled={disabled}
              ctx={'linkBtnMonitorUrl'}
              monitorUrlList={data.linkBtnMonitorUrl}
            />
          </FormItem>
          <Row>
            <Col span={18} offset={6}>
              {
                form.getFieldDecorator('needPraised', {
                  valuePropName: 'checked',
                  initialValue: data.needPraised,
                  rules: [],
                })(<Checkbox
                  disabled={disabled}
                >
                  是否需要点赞功能
                </Checkbox>)
              }
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}




