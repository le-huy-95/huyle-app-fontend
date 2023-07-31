import './PickUp.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getProjectWithPaginationWithEmployerPickUp, getDataSortByPickup, updatePickupInProject, getDataSearchByEmplyer } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"
import { getAllShippingUnit } from "../services/shippingService"

const PickUpStatusTwo = (props) => {
    let history = useHistory()
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyStaffPickup, setListProjectbyStaffPickup] = useState([])
    const [listProjectbyuserStaff, setListProjectbyuserStaff] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [isSearch, SetIsSearch] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(1)
    const [isLoading, SetIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [shipping, setShipping] = useState([])
    const [shippingUnit, setShippingUnit] = useState([])
    const [select, setSelect] = useState("")
    const handleShowModal = async () => {
        setShowModal(!showModal)
        if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupName === "Dev") {
            await getALlListNotification(+user.account.shippingunit_id, "Dev")
        }
    }

    const getShippingUnit = async () => {
        let res = await getAllShippingUnit()
        if (res && +res.EC === 0) {
            setShipping(res.DT)

        } else {
            toast.error(res.EM)

        }
    }
    const RenderforDev = async (item) => {
        if (item > 0) {
            setSelect(item)

            await fetchProjectUser(item)
        }
        if (item === "Lựa chọn đơn vị giao hàng") {
            setSelect("")
            setListProjectbyStaffPickup([])
        }
    }
    const HandleSearchData = debounce(async (value) => {
        if (!select) {
            let data = value
            if (data) {
                SetIsSearch(true)
                let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingunit_id)
                if (res && +res.EC === 0) {
                    let datasearch = res.DT.filter(item => item.statuspickup_id === 2)
                    if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupName === "Dev") {
                        await getALlListNotification(+user.account.shippingunit_id, "Dev")
                    }
                    setListProjectSearch(datasearch)
                }

            } else {
                SetIsSearch(false)
                await fetchProjectUser(select)
                if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupName === "Dev") {
                    await getALlListNotification(+user.account.shippingunit_id, "Dev")
                }
            }
        } else {
            let data = value
            if (data) {
                SetIsSearch(true)
                let res = await getDataSearchByEmplyer(data, user.account.Position, +select)
                if (res && +res.EC === 0) {
                    let datasearch = res.DT.filter(item => item.statuspickup_id === 2)
                    if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupName === "Dev") {
                        await getALlListNotification(+user.account.shippingunit_id, "Dev")
                    }
                    setListProjectSearch(datasearch)
                }

            } else {
                SetIsSearch(false)
                await fetchProjectUser(select)
                if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupName === "Dev") {
                    await getALlListNotification(+user.account.shippingunit_id, "Dev")
                }
            }
        }


    }, 200)





    const fetchProjectUser = async (select) => {
        if (!select) {
            let res = await getDataSortByPickup(+user.account.shippingunit_id, 2)
            if (res && +res.EC === 0) {
                setListProjectbyStaffPickup(res.DT)
                if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupName === "Dev") {
                    await getALlListNotification(+user.account.shippingunit_id, "Dev")
                }
            }
        } else {
            let res = await getDataSortByPickup(+select, 2)
            if (res && +res.EC === 0) {
                setListProjectbyStaffPickup(res.DT)
                if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupName === "Dev") {
                    await getALlListNotification(+user.account.shippingunit_id, "Dev")
                }
            }
        }

    }


    useEffect(() => {
        fetchProjectUser();
        if (user?.account?.groupName === "Customer" || user?.account?.groupName === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingunit_id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupName === "Dev") {
            getALlListNotification(+user.account.shippingunit_id, "Dev")
        }

    }, [currentPage])

    useEffect(() => {
        getShippingUnit()
    }, [])
    return (
        <div className='employer-pickup-container '>
            <div className='left-employer-pickup  d-none d-lg-block  '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-pickup  '>
                <div className='btn-toggle-employer-pickup d-none d-lg-block'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-employer-pickup'>
                    <div className='container'>
                        <div className='header-employer-pickup'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='location-path-employer-pickup my-2 col-12 col-lg-6'>
                                        <Link to="/"> Home</Link>

                                        <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                        </span>
                                        <Link to="/Pickup_staff">Pick up</Link>
                                    </div>
                                    <div className='search-employer-pickup my-2 col-12 col-lg-6'>
                                        <div className='search-icon-employer-pickup'>
                                            <i className="fa fa-search" aria-hidden="true"></i>

                                        </div>
                                        <input
                                            type="text"
                                            placeholder='Search infomation'
                                            onChange={(event) => HandleSearchData(event.target.value)}

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='body-employer-pickup'>
                            <div className="container">
                                <div className='name-page-employer-pickup'>
                                    <h4>
                                        {t('Pick-up.One')}
                                    </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>
                                    {user?.account?.groupName === "Dev" &&
                                        <div>
                                            <div className='container'>
                                                <div className='row'>
                                                    <select
                                                        className="form-select my-2 col-5"
                                                        onChange={(event) => { setShippingUnit(event.target.value); RenderforDev(event.target.value) }}

                                                        value={shippingUnit}


                                                    >
                                                        <option defaultValue="Lựa chọn đơn vị giao hàng">Lựa chọn đơn vị giao hàng</option>

                                                        {shipping && shipping.length > 0 &&
                                                            shipping.map((item, index) => {
                                                                return (
                                                                    <option key={`Province - ${index}`} value={item.id}>{item.NameUnit}</option>

                                                                )
                                                            })
                                                        }



                                                    </select >
                                                </div>
                                            </div>

                                        </div>
                                    }
                                    {user?.account?.groupName === "Boss" &&
                                        <div>
                                            <div className='container'>
                                                <div className='row'>
                                                    <select
                                                        className="form-select my-2 col-5"
                                                        onChange={(event) => { setShippingUnit(event.target.value); RenderforDev(event.target.value) }}

                                                        value={shippingUnit}


                                                    >
                                                        <option defaultValue="Lựa chọn đơn vị giao hàng">Lựa chọn đơn vị giao hàng</option>

                                                        {shipping && shipping.length > 0 &&
                                                            shipping.map((item, index) => {
                                                                return (
                                                                    <option key={`Province - ${index}`} value={item.id}>{item.NameUnit}</option>

                                                                )
                                                            })
                                                        }



                                                    </select >
                                                </div>
                                            </div>

                                        </div>
                                    }
                                </div>
                                <div className='sort_pickup my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-12 col-lg-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pickup_staff" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Pick-up.Two')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 my-2 content-pickup ' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_no_status" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Pick-up.Three')}
                                                </Link>

                                            </div>
                                            <div className='col-12 col-lg-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Pick-up.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 my-2 content-pickup ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Pick-up.Five')}
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>
                                        <div className='table-wrapper-employer-pickup my-5'>
                                            <div className='container'>
                                                <div className='title-employer-pickup my-3'>
                                                    {t('Pick-up.Six')} ({listProjectbyStaffPickup.length})</div>
                                                <hr />
                                                <div className='sub-title-employer-pickup'>
                                                    <div className='sub-left my-2 '>
                                                        <div className=' mx-3' style={{ color: "red" }}><i className="fa fa-flag" aria-hidden="true"></i>
                                                        </div>
                                                        <div className='NameColor'>
                                                            {t('Pick-up.Seven')}
                                                        </div>

                                                    </div>

                                                </div>
                                                <div style={{ overflow: "auto" }}>
                                                    <table className="table table-bordered table-body-employer-pickup">
                                                        <thead>
                                                            <tr className='table-secondary'>
                                                                <th scope="col"></th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Two')}
                                                                </th>

                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Three')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Four')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Five')}
                                                                </th>
                                                                <th scope="col" style={{ width: "120px" }}>
                                                                    {t('Pick-up.Body.TwentyFive')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Seven')}
                                                                </th>

                                                                <th scope="col" style={{ width: "200px" }}>
                                                                    {t('Pick-up.Body.Eight')}
                                                                </th>
                                                                <th scope="col" >
                                                                    {t('Pick-up.Body.Night')}
                                                                </th>
                                                                <th scope="col" >
                                                                    {t('Pick-up.Body.Ten')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Eleven')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.TwentyFour')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Pick-up.Body.Twelve')}
                                                                </th>


                                                            </tr>
                                                        </thead>
                                                        {listProjectbyStaffPickup && listProjectbyStaffPickup.length > 0
                                                            ?

                                                            listProjectbyStaffPickup.map((item, index) => {
                                                                return (
                                                                    <tbody>

                                                                        <tr >
                                                                            {item?.flag === true ?
                                                                                <td>
                                                                                    <span style={{ fontSize: "20px", color: "red" }}>
                                                                                        <i className="fa fa-flag" aria-hidden="true"></i>
                                                                                    </span>
                                                                                </td>
                                                                                :
                                                                                <td></td>

                                                                            }


                                                                            <td>{item.id}</td>
                                                                            <td>{item.order}</td>

                                                                            <td>
                                                                                {item?.Warehouse?.product}</td>
                                                                            <td>
                                                                                {item.quantity}/{item.unit}
                                                                            </td>
                                                                            <td>

                                                                                {item?.createdByName}
                                                                                <br />
                                                                                {item?.createdBy}
                                                                                <br />
                                                                                <b>{t('Pick-up.Body.Six')}</b>
                                                                                <br />
                                                                                {moment(`${item.createdAt}`).format("DD/MM/YYYY")}

                                                                            </td>
                                                                            <td>
                                                                                <span style={{ color: "red", fontWeight: "700" }}>
                                                                                    {item?.Statuspickup?.status ? item?.Statuspickup?.status : "chưa lấy hàng"}
                                                                                </span>

                                                                            </td>
                                                                            <td>{item?.Detail_Place_of_receipt},{item?.Addressward.name},{item?.Addressdistrict.name},{item?.Addressprovince.name}</td>



                                                                            <td>{item?.pickup_time ? moment(`${item?.pickup_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                            <td>{item?.pickupDone_time ? moment(`${item?.pickupDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                            <td>
                                                                                {item?.User_PickUp ? item?.User_PickUp : "chưa ai nhận đơn"}
                                                                                -
                                                                                {item?.Number_PickUp ? item?.Number_PickUp : ""}

                                                                            </td>
                                                                            <td>
                                                                                {item?.Note ? item?.Note : ""}
                                                                                <br />
                                                                                {item?.Notemore ? item?.Notemore : ""}

                                                                            </td>
                                                                            <td>
                                                                                {item?.statuspickup_id === 2 &&

                                                                                    <span style={{ color: "green", fontWeight: "700" }} >
                                                                                        {t('Pick-up.Body.Nineteen')}
                                                                                    </span>

                                                                                }


                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                )
                                                            })
                                                            :

                                                            <tr className="table-info">
                                                                <td colSpan={14}>
                                                                    <div className='d-flex align-item-center justify-content-center'>

                                                                        <h5>
                                                                            {t('Pick-up.Body.Sixteen')}

                                                                        </h5>

                                                                    </div>

                                                                </td>

                                                            </tr>
                                                        }



                                                    </table>
                                                </div>
                                            </div>

                                        </div>

                                    </>
                                }
                                {isSearch === true &&
                                    <div className='table-wrapper-employer-search my-5'>

                                        <div className='container'>
                                            <div className='title-employer-search my-3'>
                                                {t('Pick-up.Body.TwentyTwo')} ({listProjectSearch.length})
                                            </div>
                                            <hr />
                                            <div style={{ overflow: "auto" }}>
                                                <table className="table table-bordered table-body-employer-search">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th scope="col"></th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Two')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Pick-up.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Five')}
                                                            </th>
                                                            <th scope="col" style={{ width: "120px" }}>
                                                                {t('Pick-up.Body.TwentyFive')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Seven')}
                                                            </th>

                                                            <th scope="col" style={{ width: "200px" }}>
                                                                {t('Pick-up.Body.Eight')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Pick-up.Body.Night')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Pick-up.Body.Ten')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Eleven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.TwentyFour')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Twelve')}
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    {listProjectSearch && listProjectSearch.length > 0
                                                        ?

                                                        listProjectSearch.map((item, index) => {
                                                            return (
                                                                <tbody key={`item-${index}`}>

                                                                    <tr className="table-primary">
                                                                        {item?.flag === true ?
                                                                            <td>
                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                    <i className="fa fa-flag" aria-hidden="true"></i>
                                                                                </span>
                                                                            </td>
                                                                            :
                                                                            <td></td>

                                                                        }
                                                                        <td>{item.id}</td>
                                                                        <td>{item.order}</td>
                                                                        <td> {item?.Warehouse?.product}</td>
                                                                        <td>
                                                                            {item.quantity}/{item.unit}
                                                                        </td>
                                                                        <td>

                                                                            {item?.createdByName}
                                                                            <br />
                                                                            {item?.createdBy}
                                                                            <br />
                                                                            <b>{t('Pick-up.Body.Six')}</b>
                                                                            <br />
                                                                            {moment(`${item.createdAt}`).format("DD/MM/YYYY")}

                                                                        </td>
                                                                        <td>
                                                                            {item?.Statuspickup?.status ? item?.Statuspickup?.status : "chưa lấy hàng"}
                                                                        </td>
                                                                        <td>{item?.Detail_Place_of_receipt},{item?.Addressward.name},{item?.Addressdistrict.name},{item?.Addressprovince.name}</td>
                                                                        <td>{item?.pickup_time ? moment(`${item?.pickup_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.pickupDone_time ? moment(`${item?.pickupDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>

                                                                        <td> {item?.User_PickUp ? item?.User_PickUp : "chưa ai nhận đơn"}- {item?.Number_PickUp ? item?.Number_PickUp : "0"}</td>
                                                                        <td>
                                                                            {item?.Note ? item?.Note : ""}
                                                                            <br />
                                                                            {item?.Notemore ? item?.Notemore : ""}

                                                                        </td>
                                                                        <td>
                                                                            {item?.statuspickup_id === 2 &&

                                                                                <span style={{ color: "green", fontWeight: "700" }} >
                                                                                    {t('Pick-up.Body.Nineteen')}
                                                                                </span>

                                                                            }


                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            )

                                                        }


                                                        )
                                                        :
                                                        <tr className="table-primary">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5>
                                                                        {t('Pick-up.Body.TwentyThree')}
                                                                    </h5>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }

                                                </table>
                                            </div>
                                        </div>


                                    </div>
                                }

                            </div>

                        </div>

                    </div>

                </div>


            </div >

        </div >




    )


}

export default PickUpStatusTwo;