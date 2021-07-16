import React from 'react';
import seed from './seed.json'
import FormBuilderSchema from "react-jsonschema-form-builder";
function EditTemplate() {
    return (
        <div>
            <FormBuilderSchema
                rootSchema={seed}
            />
        </div>
    );
}

export default EditTemplate;