import React, {useEffect, useState} from "react";
import Image from "next/image";
import styles from '../Marketplace/Market.module.css';
import {fetchAgentTemplateListLocal} from "@/pages/api/DashboardService";
import AgentCreate from "@/pages/Content/Agents/AgentCreate";
import {EventBus} from "@/utils/eventBus";

export default function AgentTemplatesList({sendAgentData, selectedProjectId, fetchAgents, tools, organisationId}){
    const [agentTemplates, setAgentTemplates] = useState([])
    const [createAgentClicked, setCreateAgentClicked] = useState(false)
    const [sendTemplate, setSendTemplate] = useState(null)

    useEffect(() => {
        fetchAgentTemplateListLocal()
            .then((response) => {
                const data = response.data || [];
                setAgentTemplates(data);
            })
            .catch((error) => {
                console.error('Error fetching agent templates:', error);
            });
    }, [])

    function redirectToCreateAgent() {
        setCreateAgentClicked(true);
    }

    function openMarketplace() {
        EventBus.emit('openNewTab', { id: -4, name: "Marketplace", contentType: "Marketplace" });
    }

    function handleTemplateClick(item) {
        setSendTemplate(item);
        setCreateAgentClicked(true);
    }

    return (
        <div>
            {!createAgentClicked ?
                <div>
                <div className='row' style={{marginTop: '10px'}}>
                    <div className='col-12'>
                        <span className={styles.description_heading}
                              style={{fontWeight:'400',verticalAlign:'text-top',marginLeft:'10px',fontSize:'16px'}}>Choose a template</span>
                        <button className="primary_button" onClick={redirectToCreateAgent}
                                style={{float: 'right',marginRight: '3px'}}>&nbsp;Build From Scratch
                        </button>
                    </div>
                </div>
                <div className={styles.rowContainer} style={{maxHeight: '78vh',overflowY: 'auto',marginTop:'10px',marginLeft:'3px'}}>
                    {agentTemplates.length > 0 ? <div className={styles.resources} style={agentTemplates.length === 1 ? {justifyContent:'flex-start',gap:'7px'} : {}}>
                        {agentTemplates.map((item, index) => (
                            <div className={styles.market_tool} key={item.id} style={{cursor: 'pointer',height:'90px'}}
                                 onClick={() => handleTemplateClick(item)}>
                                <div style={{display: 'inline',overflow:'auto'}}>
                                    <div>{item.name}</div>
                                    <div className={styles.tool_description}>{item.description}</div>
                                </div>
                            </div>
                        ))}
                        <div className={styles.market_tool} style={{cursor: 'pointer',height:'90px',background:'#413C4F'}}
                             onClick={openMarketplace}>
                            <div style={{display: 'inline',overflow:'auto'}}>
                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                    <div style={{order:'0'}}><Image style={{marginTop:'-3px'}} width={16} height={16} src="/images/marketplace.svg" alt="arrow-outward"/>&nbsp;&nbsp;Browse templates from marketplace</div>
                                    <div style={{order:'1'}}><Image style={{marginTop:'-3px'}} width={16} height={16} src="/images/arrow_outward.svg" alt="arrow-outward"/></div>
                                </div>
                                <div className={styles.tool_description}>
                                    SuperAGI marketplace offers a large selection of templates to choose from, so you are sure to find one that is right for you!
                                </div>
                            </div>
                        </div>
                    </div> : <div className={styles.empty_templates}>
                        <div style={{textAlign:'center'}}>
                            <Image width={100} height={100} src="/images/marketplace_empty.svg" alt="empty-templates"/>
                            <div style={{textAlign:'center',color:'white',marginTop:'15px',fontSize:'15px'}}>Browse templates from marketplace</div>
                            <div style={{marginTop:'15px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <button className="primary_button" onClick={openMarketplace}>Go to marketplace</button>
                            </div>
                        </div>
                    </div>}
                </div>
            </div> : <AgentCreate organisationId={organisationId} sendAgentData={sendAgentData} selectedProjectId={selectedProjectId} fetchAgents={fetchAgents} tools={tools} template={sendTemplate} />}
        </div>
    )
};
