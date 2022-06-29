import React from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';


const bankDetailForm = () => {
  return (
    <div>
        <Row>
            <Col>
                <FormGroup>
                    <Label>Swift Code</Label>
                    <Input type="text" name="swiftCode" required />
                </FormGroup>
                <FormGroup>
                    <Label>Account Name</Label>
                    <Input type="text" required />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <Label>Bank Name</Label>
                    <Input type="text" required />
                </FormGroup>
                <FormGroup>
                    <Label>Account Number</Label>
                    <Input type="text" required />
                </FormGroup>
            </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label>Branch</Label>
                        <Input type="text" required />
                    </FormGroup>
                </Col>
        </Row>
    </div>
  )
}

export default bankDetailForm;
