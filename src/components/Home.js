import Log from "./Log";
import Loader from './Loader';
import styled from "styled-components";
import UserContext from "../contexts/UserContext";
import { RiLogoutBoxRLine, RiAddCircleLine, RiIndeterminateCircleLine } from "react-icons/ri";
import { useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function Home(){
    
    const history = useHistory();
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const { user } = useContext(UserContext);
    useEffect(()=>{
        const config = {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        }
        const promisse = axios.get("https://my-walliet.herokuapp.com/user",config)
        promisse.then((answer)=>{
            setLoader(false);
            console.log(answer.data);
            setData(answer.data);
        });
        promisse.catch((answer)=>{
            console.log(answer);
            if(answer.response.status === 401)history.push("/login");
        });
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    function logout(){
        const confirm = window.confirm("Você tem certeza que deseja sair?");
        if(!confirm)return;
        
        const body = {
            id: user.user.id
        }
        console.log(body);
        const promisse = axios.delete("https://my-walliet.herokuapp.com/user",{data:body});
        promisse.then(()=>{
            history.push("/login");
        }).catch(answer=>{
            console.log(answer);
            alert("Houve um problema ao sair!");
        })
    }

    function goToNewFunds(type){
        history.push(`/new-cashflow/${type}`);
    }

    return(
        <HomePage>
            { loader ? <Loader/> :
            <>
            <div className="title">
                <p>Olá, {user.user.name.split(" ")[0]}</p>
                <span onClick={logout}><RiLogoutBoxRLine className="icon"/></span>
            </div>
            
            <Log data={data}/>
            
            <div className="new-transaction-options">
                <div className="funds-option" onClick={()=>goToNewFunds("income")}>
                    <RiAddCircleLine className="icon"/>
                    <p>Nova<br/> entrada</p>
                </div>
                <div className="funds-option" onClick={()=>goToNewFunds("expense")}>
                    <RiIndeterminateCircleLine className="icon"/>
                    <p>Nova<br/> saída</p>
                </div>
            </div>
            </>
            }
        </HomePage>
    )
}

const HomePage = styled.div`
    margin-top:30px;
    margin-bottom:16px;
    height: calc(100vh - 46px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title{
        display: flex;
        justify-content: space-between;
        margin-bottom: 26px;
        font-size: 26px;
        font-weight: 700;
        color:#fff;
        cursor:default;
        p:hover{
            font-size:27px;
            margin-bottom: -1px;
        }
        .icon{
            position: fixed;
            right: 25px;
            top: 25px;
            color: #fff;
            font-size: 32px;
            &:hover{
                font-size:36px;
                right:23px;
                top:23px;
            }
        }
    }

    .new-transaction-options{
        margin-top:13px;
        display: flex;
        justify-content: space-between;

        .funds-option{
            display: flex;
            flex-direction:column;
            justify-content: space-between;
            background: #A328D6;
            color: #fff;
            height:114px;
            padding:10px;
            font-size: 17px;
            font-weight: 700;
            column-gap: 15px;
            border-radius: 5px;
            min-width: 125px;
            width: calc(50vw - 33px);
            .icon{
                font-size: 22px;
            }
            &:hover{
                font-size: 18px;
                padding-top: 9px;
                p{
                    text-shadow: -2px 2px rgba(0,0,0,0.2);
                }
                .icon{
                    font-size:24px;
                }
            }
        }
    }

`