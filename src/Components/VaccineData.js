import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./VaccineData.css"

export const VaccineData = () => {
    const [inputDate, setInputDate] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState(null);
    const [searchData, setSearchData] = useState("")
    const [filteredData, setFilteredData] = useState("")

    function validateDate() {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // date format: yyyy-mm-dd

        if (!regex.test(inputDate)) {
            setMessage('Invalid date format! Please enter a date in yyyy-mm-dd format.');
            return;
        }

        const [year, month, day] = inputDate.split('-').map(num => parseInt(num));

        const date = new Date(year, month - 1, day);

        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            setMessage('Invalid date! Please enter a valid existing date.');
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date.getTime() < today.getTime()) {
            setMessage('The entered date is already passed');
        } else {
            setMessage(null)
            const handleData = async () => {
                const res = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date=${inputDate.split("-").reverse().join("-")}`)
                setData(res?.data?.centers)
            }
            handleData()
        }
    }

    useEffect(() => {
        setFilteredData(data)
        if (searchData !== "") {
            const filterData = data.filter((item) => {
                return (item.name.toLowerCase().includes(searchData.toLowerCase()))
            })
            setFilteredData(filterData)
        }
    }, [searchData, data])

    return (
        <div >
            <div className='searchDate'>
                <label>Enter a date:</label>
                <input type="text" value={inputDate} placeholder="YYYY-MM-DD" onChange={e => setInputDate(e.target.value)} className='dateholder' />
                <button onClick={validateDate} >Go</button>
            </div>
            <div>
                {message !== null ? <div style={{textAlign:"center"}}>{message}</div> :
                    (<>

                        {data?.length !== 0 ?
                            <>
                                <div className='searchbar'>
                                    <input onChange={(e) => setSearchData(e.target.value)} placeholder='Search By Name'></input>
                                </div>
                                <table>
                                    <thead>
                                        <th>No.</th>
                                        <th>Name</th>
                                        <th>Vaccine</th>
                                        <th>AvailableCapacity</th>
                                        <th>Slots</th>

                                    </thead>
                                    <tbody>
                                        {filteredData?.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.sessions[0].vaccine}</td>
                                                    <td>{item.sessions[0].available_capacity}</td>
                                                    <td>{item.sessions[0].slots.map((item) => {
                                                        return (
                                                            <div>
                                                                {item.time}
                                                            </div>
                                                        )
                                                    })}</td>

                                                </tr>

                                            )
                                        })}

                                    </tbody>
                                </table>
                            </>
                            : "No Center Available"}
                    </>
                    )}
            </div>

        </div>
    )
}