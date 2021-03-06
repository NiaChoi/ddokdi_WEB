import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Paper  from '@material-ui/core/Paper';
import App_bar_for_admin_page from './Appbar';
import { FixedSizeList } from 'react-window';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

import MsgProcessor from "./servepart/MsgProcessor"
var moment = require('moment');

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper_1: {  //전체 크기 변환 height 변경
    padding: theme.spacing(1),
    textAlign: 'center',
    height:'584x',       
    color: theme.palette.text.secondary,
  },
  card_d: {
    Width: 400,
    height:568,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

class admin_client_manager extends Component {
  
  constructor(props){
    super(props);
    this.max_content_id = 3;//UI에 영향을 주지 않으므로 state X
    this.state = {
      Client_List_without_admin: [{"Client_USERID":"", "name":"","age":""}],
      nlistLength: 0,
      ClientUSERID:0,
      list_for_checking_emergency:[],
      checking_latest_timestamp:[{"emergency_service_USERID":"", "timestamp":"", "phone_no":"", "name":"", "emergency_contact":"", "relationship_emergency_res":""}],
      Detail_client_list: [],
      emergency_service_table_timestamp:0,
      Emergency_service: true
      }
    }

  
   
  
    componentDidMount(){      
      let userId = localStorage.getItem("USN");
      let msgProc = new MsgProcessor();
      msgProc.attemptadminclientManager(userId, (result)=> { 
        if (result[0] == 0) {
          console.log(result[1]);
          this.setState({
            Client_List_without_admin:result[1],
            nlistLength:result[1].length
          })
        }
      });
      let state_of_emergency_detector = setInterval(this.handle_emergency_alert, 10000);
      
      // function emergency_alert(string) {
      //   emergency_watcher = {this.handle_emergency_alert}
      // }
    }
    
    handle_emergency_alert = (event, a) => {
      // alert('왜안되지?');

      
      let userId = localStorage.getItem("USN");
      let msgProc = new MsgProcessor();             
      let timestamp_checking_list = this.state.checking_latest_timestamp;
              // timestamp_checking_list.forEach(element =>{
                // if(element.timestamp <= d_t){      //테스트용
                // // if(element.timestamp <= d_t.setHours(d_t.getHours()-4)){
                //   Client_userId_for_emergency_alert = element.emergency_service_USERID;
                // }
              // });  
          msgProc.attempt_emergency_situation_checking(userId, (result)=> { 
            if (result[0] == 0) {
              this.setState({
                timestamp_checking_list:result[1][0]                        
              });
              var d_t = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                if(this.state.timestamp_checking_list.timestamp[0] < d_t){   //테스트용
                // if(element.timestamp <= d_t.setHours(d_t.getHours()-4)){ 
                  console.log("emergency!");
                  var song = new Audio();
                  song.src = 'siren.mp3';
                  song.play(); 
                 
                  alert('주의! '+this.state.timestamp_checking_list.name + '님 확인요망'+ '\n'+
                  '[전화번호] '+this.state.timestamp_checking_list.phone_no +'\n'+
                  '[비상연락인] '+this.state.timestamp_checking_list.relationship_emergency_res +'\n'+
                  '[비상연락망] '+this.state.timestamp_checking_list.emergency_contact +'\n'                  
                  );
                  
                  // clearInterval();
                }
              }
            else{
              console.log("everything is fine")

            }
              });
      }
    
    
      



    handleChange = (event, a) => {
      // event.preventDefault();
      console.log(event);
      let userId = localStorage.getItem("USN");
      let msgProc = new MsgProcessor();
      let client_list = this.state.Client_List_without_admin;
      client_list = client_list.concat(this.state.Client_List_without_admin);
      let Client_userId_for_detail = this.state.ClientUSERID;    
      if (this.state.Emergency_service == false){
        msgProc.attempt_Client_Emergency_Service_Update(Client_userId_for_detail, userId, (result)=> { 
          if (result[0] == 0) {
            // alert("위급 알림 서비스가 활성화되었습니다.");
            console.log(result[0]);
            msgProc.attemptDetailClient(Client_userId_for_detail, userId, (result)=> { 
              if (result[0] == 0) {
                console.log(result[1][0]);
                console.log(result[1][0].emergency_service);
                this.setState({
                  Detail_client_list:result[1][0],
                  
                })
                if (result[1][0].emergency_service == 0)  {
                  this. setState({
                    Emergency_service:false
                  })
                }
                else {
                  this. setState({
                    Emergency_service:true
                })
                }
            } 
          });
          }
          else {
            alert(result[1]);
          }
        });           
        // alert("위급 알림 서비스가 활성화되었습니다.");
      }
      else {
        msgProc.attempt_Client_Emergency_Service_Update(Client_userId_for_detail, userId, (result)=> { 
          if (result[0] == 0) {
            // alert("위급 알림 서비스가 해제되었습니다.");
            console.log(result[0]);
            msgProc.attemptDetailClient(Client_userId_for_detail, userId, (result)=> { 
              if (result[0] == 0) {
                console.log(result[1][0]);
                console.log(result[1][0].emergency_service);
                this.setState({
                  Detail_client_list:result[1][0],
                  
                })
                if (result[1][0].emergency_service == 0)  {
                  this. setState({
                    Emergency_service:false
                  })
                }
                else {
                  this. setState({
                    Emergency_service:true
                })
                }
            } 
          });
          }
          else {
            alert(result[1]);
          }
        });
        // alert("위급 알림 서비스가 해제되었습니다.");        
      }

    }
    //   this.setState({
    //     ClientUSERID:Client_userId_for_detail });
    // };

   
    
  
    handleListItemClick = event => {
      event.preventDefault();
      console.log(event);
      let userId = localStorage.getItem("USN");
      let msgProc = new MsgProcessor();
        let selectedClient = event.target.innerText;
        let client_list = this.state.Client_List_without_admin;
        client_list = client_list.concat(this.state.Client_List_without_admin);
        let Client_userId_for_detail = this.state.ClientUSERID+'';
        client_list.forEach(element => {
          if(element.name === selectedClient){
            Client_userId_for_detail = element.Client_USERID;
          }
        });
    
      this.setState({
        ClientUSERID:Client_userId_for_detail        
      });
      msgProc.attemptDetailClient(Client_userId_for_detail, userId, (result)=> { 
        if (result[0] == 0) {
          console.log(result[1][0]);
          console.log(result[1][0].emergency_service);
          this.setState({
            Detail_client_list:result[1][0],
            
          })
          if (result[1][0].emergency_service == 0)  {
            this. setState({
              Emergency_service:false
            })
          }
          else {
            this. setState({
              Emergency_service:true
          })
          }
      } 
    });
  }

    
      

      renderNewRow(mState, handleListItemClick ,props) {
        const { index, style } = props;
        console.log(mState.Client_List_without_admin);
        let client_list =[];
        mState.Client_List_without_admin.forEach(element => {
          client_list.push(element.name);
        });

        console.log(handleListItemClick);
        // const mnRow = med_name.length;
        // // const med_time = [,];
        return (          
          <form onSubmit={this.handleListItemClick}>
            <ListItem button onClick={handleListItemClick} style={style} key={index} id={1}>
              <ListItemText primary= {<Typography variant="h5" Align="left">{client_list[index]} </Typography>}/>
            </ListItem>
            </form>
        );
      }
      // renderActivateRow(mState, handleListItemClick ,props) {
      //   const { index, style } = props;
      //   console.log(mState.Activate_Emergency_Service_list);
      //   const [checked, setChecked] = React.useState(false); 

      //   let client_list =[];
      //   mState.Activate_Emergency_Service_list.forEach(element => {
      //     client_list.push(element.name);
      //   });

      //   console.log(handleListItemClick);
      //   // const mnRow = med_name.length;
      //   // // const med_time = [,];
      //   return (          
      //     <form onSubmit={this.handleListItemClick}>
      //       <ListItem button onClick={handleListItemClick} style={style} key={index} id={1}>
      //         <ListItemText primary={<Typography variant="h5" Align="left">{client_list[index]} </Typography>}/>
      //       </ListItem>
      //       </form>
      //   );
      // }

  // titleselect();
  // if()

  render(){
    
    const { classes } = this.props; 
    console.log(this.state.Detail_client_list);
    return (
      <div >
        <App_bar_for_admin_page history = {this.props.history}/>
        <Grid container className={classes.root} spacing = {0}>
        {/* paper_1 첫번째 칸 */}
         

        {/* paper_2 두번째 칸 */}
          <Grid item xs={5} >
          <Paper className={classes.paper_1}>
          {this.state.nlistLength !== 0 ? 
           <Box color="text.secondary" fontSize={20} textAlign="left" fontWeight="fontWeightBold">
              Client List
              </Box>
              :
              <Box color="text.secondary" fontSize={20} textAlign="left" fontWeight="fontWeightBold">
              Client List</Box>              
              }
              
              {this.state.nlistLength !== 0 ?
              <FixedSizeList height={542} width='90%' itemSize={60} itemCount={this.state.nlistLength}>
              {this.renderNewRow.bind(this, this.state, this.handleListItemClick)}
              </FixedSizeList>
              :
              <FixedSizeList height={542} width='90%' itemSize={60} itemCount={this.state.nlistLength}>
              {this.renderNewRow.bind(this, this.state, this.handleListItemClick)}
              </FixedSizeList>
              }
              </Paper>
            </Grid>

            <Grid item xs={5} >
              <Paper className={classes.paper_1}>
                <Card className={classes.card_d}>
                  <CardHeader
                    title={this.state.Detail_client_list.name}
                    subheader={this.state.Detail_client_list.Client_USERID}
                    />
                  <CardContent>
                    {this.state.ClientUSERID !== 0 ?
                    <Typography align="left" variant="h5" color="textSecondary" component="p" >
                    <Box color="text.secondary" fontSize={20} textAlign="left" fontWeight="fontWeightBold">
                      [생년월일] <br/>{this.state.Detail_client_list.age}<br/>
                      [ID] <br/>{this.state.Detail_client_list.id}<br/>
                      [비밀번호] <br/>{this.state.Detail_client_list.passwords}<br/>
                      [성별] <br/>{this.state.Detail_client_list.gender}<br/>
                      [연락처] <br/>{this.state.Detail_client_list.phone_no}<br/>
                      [비상연락망] <br/>{this.state.Detail_client_list.emergency_contact}<br/>
                      [비상연락인 관계] <br/>{this.state.Detail_client_list.relationship_emergency_res}<br/>
                      [위급알림서비스활성화] <br/>
                      <form noValidate onSubmit ={this.handle_Emergency_Service_Update_Submit}>
                      <Switch
                        checked={this.state.Emergency_service}
                        onChange={this.handleChange}
                        name="emergency_service_state"
                        
                        inputProps={{ "aria-label": "secondary checkbox" }}/>
                        </form>
                      <br/>
                    </Box>
                    </Typography>
                     : <Typography variant="body2" color="textSecondary" component="p"/>}
                 </CardContent>
                </Card>               
              </Paper>
              </Grid> 
          </Grid>
      </div>
      );
    }
  }
export default  withStyles( useStyles )(admin_client_manager);