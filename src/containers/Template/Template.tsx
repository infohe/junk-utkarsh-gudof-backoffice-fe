import React, { useCallback, useState } from 'react';
import { withStyle } from 'baseui';
import { Button, KIND } from 'baseui/button'
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { useDrawerDispatch } from 'context/DrawerContext';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
// import Button from 'components/Button/Button';
import Checkbox from 'components/CheckBox/CheckBox';
import { useQuery, gql } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
    TableWrapper,
    StyledTable,
    StyledHeadCell,
    StyledCell,
    ImageWrapper,
} from './Template.style';
import { Plus } from 'assets/icons/Plus';
import * as icons from 'assets/icons/category-icons';
import NoResult from 'components/NoResult/NoResult';

const GET_CATEGORIES = gql`
  query getCategories($type: String, $searchBy: String) {
    categories(type: $type, searchBy: $searchBy) {
      id
      icon
      name
      slug
      type
    }
  }
`;

const Col = withStyle(Column, () => ({
    '@media only screen and (max-width: 767px)': {
        marginBottom: '20px',

        ':last-child': {
            marginBottom: 0,
        },
    },
}));

const Row = withStyle(Rows, () => ({
    '@media only screen and (min-width: 768px)': {
        alignItems: 'center',
    },
}));

const categorySelectOptions = [
    { value: 'grocery', label: 'Grocery' },
    { value: 'women-cloths', label: 'Women Cloth' },
    { value: 'bags', label: 'Bags' },
    { value: 'makeup', label: 'Makeup' },
];

export default function Category() {
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState('');
    const dispatch = useDrawerDispatch();
    const [checkedId, setCheckedId] = useState([]);
    const [checked, setChecked] = useState(false);
    const openDrawer = useCallback(
        () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'EDIT_TEMPLATE' }),
        [dispatch]
    );

    const { data, error, refetch } = useQuery(GET_CATEGORIES);
    if (error) {
        return <div>Error! {error.message}</div>;
    }
    function handleCategory({ value }) {
        setCategory(value);
        if (value.length) {
            refetch({
                type: value[0].value,
            });
        } else {
            refetch({
                type: null,
            });
        }
    }

    function onAllCheck(event) {
        if (event.target.checked) {
            const idx = data && data.categories.map((current) => current.id);
            setCheckedId(idx);
        } else {
            setCheckedId([]);
        }
        setChecked(event.target.checked);
    }

    function handleCheckbox(event) {
        const { name } = event.currentTarget;
        if (!checkedId.includes(name)) {
            setCheckedId((prevState) => [...prevState, name]);
        } else {
            setCheckedId((prevState) => prevState.filter((id) => id !== name));
        }
    }
    const Icon = ({ name }) => {
        const TagName = icons[name];
        return !!TagName ? <TagName /> : <p>Invalid icon {name}</p>;
    };

    return (
        <Grid fluid={true}>
            <Row>
                <Col md={12}>
                    <Header
                        style={{
                            marginBottom: 30,
                            boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
                        }}
                    >
                        <Col md={2}>
                            <Heading>Templates</Heading>
                        </Col>

                        <Col md={10}>
                            <Row>
                                <Col md={3} lg={3}>
                                    <Select
                                        options={categorySelectOptions}
                                        labelKey="label"
                                        valueKey="value"
                                        placeholder="Sort by"
                                        value={category}
                                        searchable={false}
                                        onChange={handleCategory}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Header>

                    <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
                        <TableWrapper>
                            <StyledTable $gridTemplateColumns="minmax(70px, 70px) minmax(70px, 70px) minmax(70px, 70px) minmax(150px, auto) minmax(150px, auto) auto">
                                <StyledHeadCell>
                                    <Checkbox
                                        type="checkbox"
                                        value="checkAll"
                                        checked={checked}
                                        onChange={onAllCheck}
                                        overrides={{
                                            Checkmark: {
                                                style: {
                                                    borderTopWidth: '2px',
                                                    borderRightWidth: '2px',
                                                    borderBottomWidth: '2px',
                                                    borderLeftWidth: '2px',
                                                    borderTopLeftRadius: '4px',
                                                    borderTopRightRadius: '4px',
                                                    borderBottomRightRadius: '4px',
                                                    borderBottomLeftRadius: '4px',
                                                },
                                            },
                                        }}
                                    />
                                </StyledHeadCell>
                                <StyledHeadCell>Id</StyledHeadCell>
                                <StyledHeadCell>image</StyledHeadCell>
                                <StyledHeadCell>Name</StyledHeadCell>
                                <StyledHeadCell>Type</StyledHeadCell>
                                <StyledHeadCell>Updated At</StyledHeadCell>
                                <React.Fragment >
                                    <StyledCell>
                                        <Checkbox
                                            name={'template'}
                                            checked={checkedId.includes('template')}
                                            onChange={handleCheckbox}
                                            overrides={{
                                                Checkmark: {
                                                    style: {
                                                        borderTopWidth: '2px',
                                                        borderRightWidth: '2px',
                                                        borderBottomWidth: '2px',
                                                        borderLeftWidth: '2px',
                                                        borderTopLeftRadius: '4px',
                                                        borderTopRightRadius: '4px',
                                                        borderBottomRightRadius: '4px',
                                                        borderBottomLeftRadius: '4px',
                                                    },
                                                },
                                            }}
                                        />
                                    </StyledCell>
                                    <StyledCell>{'template'}</StyledCell>
                                    <StyledCell>
                                        <StyledCell>{ }</StyledCell>
                                    </StyledCell>
                                    <StyledCell>
                                    <Button
                                        kind={KIND.minimal}
                                        onClick={openDrawer}
                                        overrides={{
                                            BaseButton: {
                                                style: () => ({
                                                }),
                                            },
                                        }}
                                    >
                                        {'TemplateName'}
                                    </Button>
                                    </StyledCell>
                                    <StyledCell>{'col2'}</StyledCell>
                                    <StyledCell>
                                        {'someDate'}
                                    </StyledCell>
                                </React.Fragment>



                                {/* {data ? (
                  data.categories.length ? (
                    data.categories
                      .map((item) => Object.values(item))
                      .map((row, index) => (
                        <React.Fragment key={index}>
                          <StyledCell>
                            <Checkbox
                              name={row[1]}
                              checked={checkedId.includes(row[1])}
                              onChange={handleCheckbox}
                              overrides={{
                                Checkmark: {
                                  style: {
                                    borderTopWidth: '2px',
                                    borderRightWidth: '2px',
                                    borderBottomWidth: '2px',
                                    borderLeftWidth: '2px',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    borderBottomRightRadius: '4px',
                                    borderBottomLeftRadius: '4px',
                                  },
                                },
                              }}
                            />
                          </StyledCell>
                          <StyledCell>{row[1]}</StyledCell>
                          <StyledCell>
                            <ImageWrapper>
                              <Icon name={row[2]} />
                            </ImageWrapper>
                          </StyledCell>
                          <StyledCell>{row[3]}</StyledCell>
                          <StyledCell>{row[4]}</StyledCell>
                          <StyledCell>{row[5]}</StyledCell>
                        </React.Fragment>
                      ))
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: '1',
                        gridColumnEnd: 'one',
                      }}
                    />
                  )
                ) : null} */}
                            </StyledTable>
                        </TableWrapper>
                    </Wrapper>
                </Col>
            </Row>
        </Grid>
    );
}