import React, { useState } from 'react';
import IceContainer from '@icedesign/container';
import {
  Input,
  Button,
  Message,
  NumberPicker,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import PageHead from '@/components/PageHead';
import styles from './index.module.scss';
import { postData } from "@/util";

let form;
export default function GoodsForm() {
  const [value] = useState({});

  const formChange = (formValue) => {
    console.log('value', formValue);
  };

  const validateAllFormField = () => {
    form.validateAll((errors, values) => {
      if (errors) {
        return;
      }
      console.log({ ...values });
      postData("/add-goods", { ...values }).then(() => {
        Message.success('提交成功');
      });
    });
  };

  return (
    <div>
      <PageHead title="添加商品" />
      <IceContainer className={styles.iceContainer}>
        <IceFormBinderWrapper
          value={value}
          onChange={formChange}
          ref={formRef => form = formRef}
        >
          <div className={styles.formItem}>
            <div className={styles.formLabel}>商家id：</div>
            <IceFormBinder name="businessId" required message="商家id必填">
              <Input
                placeholder="请输入商家id"
                className={styles.goodsName}
              />
            </IceFormBinder>
            <div className={styles.formError}>
              <IceFormError name="businessId" />
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.formLabel}>商品名称：</div>
            <IceFormBinder name="name" required message="商品名称必填">
              <Input
                placeholder="请输入商品名称"
                className={styles.goodsName}
              />
            </IceFormBinder>
            <div className={styles.formError}>
              <IceFormError name="name" />
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.formLabel}>商品简介：</div>
            <IceFormBinder name="desc" required message="商品简介：必填">
              <Input
                placeholder="请输入商品简介："
                className={styles.goodsName}
              />
            </IceFormBinder>
            <div className={styles.formError}>
              <IceFormError name="desc" />
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.formLabel}>库存量：</div>
            <IceFormBinder name="remain" required message="库存量必填">
              <NumberPicker />
            </IceFormBinder>
          </div>
          <div className={styles.formItem}>
            <div className={styles.formLabel}>商品分类：</div>
            <IceFormBinder name="categoryId" required message="商品分类必填">
              <NumberPicker />
            </IceFormBinder>
          </div>
          <div className={styles.formItem}>
            <div className={styles.formLabel}>商品价格：</div>
            <IceFormBinder name="price" required message="商品价格必填">
              <Input
                placeholder="请输入商品价格: ￥199.99"
                className={styles.goodsName}
              />
            </IceFormBinder>
            <div className={styles.formError}>
              <IceFormError name="price" />
            </div>
          </div>
          <div className={styles.formItem}>
          <div className={styles.formLabel}>商品图片</div>
            <IceFormBinder name="url" required message="商品图片：必填">
              <Input
                placeholder="请输入商品图片："
                className={styles.goodsName}
              />
            </IceFormBinder>
            <div className={styles.formError}>
              <IceFormError name="url" />
            </div>
          </div>
          <Button
            type="primary"
            onClick={validateAllFormField}
          >
            提 交
          </Button>
        </IceFormBinderWrapper>
      </IceContainer>
    </div>
  );
}
