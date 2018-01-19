import React, {Component} from 'react';
import LoginCard from './LoginCard/LoginCard.jsx';
import { GridList } from 'material-ui/GridList';
import './LoginCardList.css';

class LoginCardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Authentication tokens specific to each vendor to be included in login options
            // To add more elements, simply add an object to the elements array, for example uncomment the "salesforce" object
            elements: [
                {
                    nameText: "Hubspot Marketing",
                    elementKey: "hubspot",
                    vendorApiKey: process.env.REACT_APP_HUBSPOT_KEY,
                    vendorSecret: process.env.REACT_APP_HUBSPOT_SECRET
                },
                {
                    nameText: "Salesforce",
                    elementKey: "sfdc",
                    vendorApiKey: process.env.REACT_APP_SFDC_KEY,
                    vendorSecret: process.env.REACT_APP_SFDC_SECRET
                },
                {
                    nameText: "Marketo",
                    elementKey: "marketo",
                    vendorApiKey: process.env.REACT_APP_MARKETO_KEY,
                    vendorSecret: process.env.REACT_APP_MARKETO_SECRET
                }
            ]
        };
    }

    renderLoginCards() {
        let { ceKeys, appUrl, errorMessage } = this.props;
        return this.state.elements.map(element => (
            <LoginCard 
                key={ element.elementKey }
                vendorData={ element }
                ceKeys={ ceKeys }
                errorMessage={ errorMessage }
                baseUrl={'https://' + [ceKeys.ceEnv || 'api'] + '.cloud-elements.com/elements/api-v2'}
                vendorCallbackUrl={ appUrl }
            />
        ));
      }

      render() {
        // retrieve element data from the state obj above
        let { elements } = this.state;
        // retrieve generic app info from the props passed by App.jsx
        let { ceKeys, appUrl, errorMessage } = this.props;
        // return as many LoginCards as needed for the number of elements in the state.elements array
        return (
            <GridList cols={3}>
                {elements.map(element => (
                    <LoginCard 
                        key={ element.elementKey }
                        vendorData={ element }
                        ceKeys={ ceKeys }
                        errorMessage={ errorMessage }
                        baseUrl={'https://' + [ceKeys.ceEnv || 'api'] + '.cloud-elements.com/elements/api-v2'}
                        vendorCallbackUrl={ appUrl }
                    />
                ))}
            </GridList>
        );
      }
}

export default LoginCardList;