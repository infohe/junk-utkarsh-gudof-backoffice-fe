import React from 'react';
import seed from './seed.json'
import FormBuilderSchema from "react-jsonschema-form-builder";
import { Col, Grid, Row } from 'components/FlexBox/FlexBox'
import { Header, Heading } from 'components/Wrapper.style';
function Template() {
    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header style={{ marginBottom: 15 }} >
                        <Col md={2} xs={12}>
                            <Heading>Templates</Heading>
                        </Col>
                    </Header>
                </Col>
                <FormBuilderSchema rootSchema={seed}/>
            </Row>
        </Grid>
    );
}

export default Template;