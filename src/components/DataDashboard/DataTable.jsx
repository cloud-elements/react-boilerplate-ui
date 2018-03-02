import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableHead, TableBody, TableCell, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import db from 'store2';
// service for dummy data, later will be for live API calls
import {dummyGenerator, headerGenerator} from './dummyDataGenerator';


const styles = theme => ({
  root: {
    margin: (theme.spacing.unit * 3) - 4,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Datatable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getObjects = (objectName, elementToken) => {
      // fix base url to be CE url not ngrok
      let {ceKeys, vendorData, vendorCallbackUrl, baseUrl} = this.props;
      let path= `elements/${objectName}`;
            // The configuration for fetching data
            let config = {
                method: 'GET',
                headers: {
                'Authorization': `User ${ceKeys.userToken}, Organization ${ceKeys.orgToken}, Element ${elementToken}`,
                'Content-Type': 'application/json'
                }
            }
            const request = async () => {
                const response = await fetch(`${baseUrl}/${path}`, config);
                console.log(response);
                const json = await response.json();
                console.log(json);
                return await json;
            }
            request();
    }

    render(){
      const { classes, contentType } = this.props;
      // generate headers and 5 rows of dummy data for visuals before adding live data
      let headers = headerGenerator(contentType);
      let data;
      // check db for instance keys, and call out for live data
      if (db('hubspotcrm')){
        console.log('token: ' + db('hubspotcrm'));
        this.getObjects('contacts', db('hubspotcrm'));
      }
      if (true) {
        data = dummyGenerator(contentType);
      }
      
      // convert contents to title
      let title;
      if (contentType) title = contentType[0].toUpperCase() + contentType.slice(1);
      return (
        <Paper className={classes.root}>
          <Toolbar>
            <Typography variant="title" color="inherit">
              {title}
            </Typography>
          </Toolbar>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {headers.map(headerText => {
                  return(
                    <TableCell>{headerText}</TableCell>
                  )
                })}
              </TableRow>
            </TableHead> 
            <TableBody>
              {data.map(n => {
                return(
                  <TableRow key={n.id}>
                    {headers.map((headerText) => {
                      return(
                        <TableCell>{n[headerText]}</TableCell>
                      )
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      );
    };
}

Datatable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Datatable);