import React, { useState } from 'react';
import { Grid, Input } from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';

const { Row, Col } = Grid;

export default function Filter(props) {
  const [value] = useState({});

  const formChange = (formValue) => {
    props.onChange(formValue);
  };

  return (
    <IceContainer>
      <IceFormBinderWrapper
        value={value}
        onChange={formChange}
      >
        <Row wrap gutter="20" className={styles.formRow}>
          <Col l="8">
            <div className={styles.formItem}>
              <span className={styles.formLabel}>商品Id：</span>
              <IceFormBinder triggerType="onBlur" name="id">
                <Input placeholder="请输入" />
              </IceFormBinder>
              <div className={styles.formError}>
                <IceFormError name="id" />
              </div>
            </div>
          </Col>
          <Col l="8">
            <div className={styles.formItem}>
              <span className={styles.formLabel}>订单状态：</span>
              <IceFormBinder triggerType="onBlur" name="status">
                <Input placeholder="请输入" />
              </IceFormBinder>
              <div className={styles.formError}>
                <IceFormError name="status" />
              </div>
            </div>
          </Col>
        </Row>
      </IceFormBinderWrapper>
    </IceContainer>
  );
}
