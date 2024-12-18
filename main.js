
    let globalChiTietOptions = {};
    // Thêm các hàm xử lý
    function searchCustomer() {
        const searchInput = document.getElementById('searchInput');
        const searchValue = searchInput ? searchInput.value.trim() : '';
        
        if (!searchValue) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng nhập số điện thoại'
            });
            return;
        }

        // Hiển thị loading
        Swal.fire({
            title: 'Đang tìm kiếm...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Dữ liệu mẫu giả định từ backend
        const mockResponse = {
            customerInfo: {
                customerName: 'Nguyễn Văn A',
                customerID: 'noname',
                customerCode: '145',
                customerEmail: 'undefine'
            }
        };

        // Thay thế google.script.run bằng dữ liệu mẫu
        setTimeout(() => {
            // Gọi hàm xử lý thành công với dữ liệu mẫu
            Swal.close();
            console.log('Received result:', mockResponse);
            // Gọi lại phần xử lý thành công
            handleSuccess(mockResponse);
        }, 1000);
    }

    function handleSuccess(result) {
        if (result && result.customerInfo) {
            // Tạo chuỗi thông tin theo đúng format hiện tại
            const info = result.customerInfo;
            const contactText = `Name:${info.name} Căn cước/CMT:${info.id || 'N/A'} Mã Khách Hàng:${info.code} Email:${info.email}`;
            
            // Cập nhật nội dung
            const contactElement = document.querySelector('.contact-info');
            if (contactElement) {
                contactElement.innerHTML = `
                    <div class="contact-header">
                        <i class="fas fa-user"></i>
                        <span>Contact</span>
                    </div>
                    <div class="contact-details">
                        <div class="contact-item">
                            <span>Name:</span> <span id="customerName" >${info.customerName || 'N/A'}</span>
                        </div>
                        <div class="contact-item">
                            <span>Căn cước/CMT:</span> <span id="customerID">${info.customerID || 'N/A'}</span>
                        </div>
                        <div class="contact-item">
                            <span>Mã Khách Hàng:</span> <span id="customerCode">${info.customerCode || 'N/A'}</span>
                        </div>
                        <div class="contact-item">
                            <span>Email:</span> <span id="customerEmail">${info.customerEmail || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }

            // Cập nhật bảng tương tác
            updateInteractionTable(result.interactions);

            Swal.fire({
                icon: 'success',
                title: 'Tìm thấy khách hàng!',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            resetForm();
            Swal.fire({
                icon: 'info',
                title: 'Không tìm thấy',
                text: 'Không tìm thấy thông tin khách hàng'
            });
        }
    }

    // Hàm format date riêng biệt
    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateStr;
        }
    }

    function populateDropdowns(options) {
        console.log('Received options:', options); // Debug log
        globalChiTietOptions = options.chiTietNhuCau;
    
        // Populate Nhu Cầu KH
        const nhuCauSelect = document.getElementById('nhuCauKH');
        if (nhuCauSelect && options.nhuCauKH) {
            nhuCauSelect.innerHTML = '<option value="">Chọn nhu cầu</option>';
            options.nhuCauKH.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                nhuCauSelect.appendChild(opt);
            });
        }
        nhuCauSelect.addEventListener('change', updateChiTietDropdown);
        // Populate Loại DV
        const loaiDVSelect = document.getElementById('loaiDV');
        if (loaiDVSelect && options.loaiDV) {
            loaiDVSelect.innerHTML = '<option value="">Chọn loại dịch vụ</option>';
            options.loaiDV.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                loaiDVSelect.appendChild(opt);
            });
        }
    
        // Populate Trạng thái Xử Lý
        const trangThaiSelect = document.getElementById('trangThai');
        if (trangThaiSelect && options.trangThai) {
            trangThaiSelect.innerHTML = '<option value="">Chọn trạng thái</option>';
            options.trangThai.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                trangThaiSelect.appendChild(opt);
            });
        }
    
        // Populate Phối Hợp Liên Phòng Ban
        const phoiHopSelect = document.getElementById('phoiHop');
        if (phoiHopSelect && options.phoiHop) {
            phoiHopSelect.innerHTML = '<option value="Không">Không</option>';
            options.phoiHop.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                phoiHopSelect.appendChild(opt);
            });
        }
    
        // Populate Kênh Tiếp Nhận
        const kenhTiepNhanSelect = document.getElementById('kenhTiepNhan');
        if (kenhTiepNhanSelect && options.kenhTiepNhan) {
            kenhTiepNhanSelect.innerHTML = '<option value="Inbound">Inbound</option>';
            options.kenhTiepNhan.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                kenhTiepNhanSelect.appendChild(opt);
            });
        }
    }
    function updateChiTietDropdown() {
        const nhuCauValue = document.getElementById('nhuCauKH').value;
        const chiTietSelect = document.getElementById('chiTietNhuCau');
        
        // Reset chi tiết dropdown
        chiTietSelect.innerHTML = '<option value="">Chọn chi tiết</option>';
        
        // If there's a selected value and we have child options for it
        if (nhuCauValue && globalChiTietOptions[nhuCauValue]) {
            globalChiTietOptions[nhuCauValue].forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                chiTietSelect.appendChild(opt);
            });
            chiTietSelect.disabled = false;
        } else {
            chiTietSelect.disabled = true;
        }
    }
    function updateCustomerInfo(info) {
        const contactElement = document.querySelector('.contact-info');
        if (contactElement) {
            contactElement.innerHTML = `
                <div class="contact-header">
                    <i class="fas fa-user"></i>
                    <span>Contact</span>
                </div>
                <div class="contact-details">
                    <div class="contact-item">
                        <span>Name: </span><span id="customerName">${info.customerName || 'N/A'}</span>
                    </div>
                    <div class="contact-item">
                        <span>Căn cước/CMT:</span> <span id="customerID">${info.customerID || 'N/A'}</span>
                    </div>
                    <div class="contact-item">
                        <span>Mã Khách Hàng:</span> <span id="customerCode">${info.customerCode || 'N/A'}</span>
                    </div>
                    <div class="contact-item">
                        <span>Email:</span> <span id="customerEmail">${info.customerEmail || 'N/A'}</span>
                    </div>
                </div>
            `;
        }
    }

    function updateInteractionTable(interactions) {
        const tableBody = document.querySelector('.ticket-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (interactions && interactions.length > 0) {
            interactions.forEach(interaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${interaction.timeStart || ''}</td>
                    <td>${interaction.nhuCauKH || ''}</td>
                    <td>${interaction.chiTietNhuCau || ''}</td>
                    <td>${interaction.noteInput || ''}</td>
                    <td>${interaction.agent || ''}</td>
                    <td>${interaction.ticketSerial || ''}</td>
                    <td>${interaction.trangThai || ''}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">Không có lịch sử tương tác</td>
                </tr>
            `;
        }
    }

    function resetForm() {
        const contactElement = document.querySelector('.contact-info');
        if (contactElement) {
            contactElement.innerHTML = `
                <div class="contact-header">
                    <i class="far fa-user-circle"></i>
                    <span>Contact</span>
                </div>
                <div class="contact-grid">
                    <div class="contact-column">
                        <div class="contact-label">Name</div>
                        <div class="contact-value">Unname</div>
                    </div>
                    <div class="contact-column">
                        <div class="contact-label">Căn cước/CMT</div>
                        <div class="contact-value">Undefined</div>
                    </div>
                    <div class="contact-column">
                        <div class="contact-label">Mã Khách Hàng</div>
                        <div class="contact-value">null</div>
                    </div>
                    <div class="contact-column">
                        <div class="contact-label">Email</div>
                        <div class="contact-value">null</div>
                    </div>
                </div>
            `;
        }
        
        // Reset bảng tương tác
        const tableBody = document.querySelector('.ticket-table tbody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">Không có lịch sử tương tác</td>
                </tr>
            `;
        }
    }

    // Thêm event listener cho nút tìm kiếm
    document.addEventListener('DOMContentLoaded', function() {
        const searchButton = document.querySelector('.search-btn');
        if (searchButton) {
            searchButton.onclick = searchCustomer;
        }
    });

    // Thêm CSS để định dạng hiển thị
    const style = document.createElement('style');
    style.textContent = `
    .contact-info {
        font-family: 'Barlow', sans-serif;
        font-size: 14px;
        color: #333;
        padding: 10px;
    }

    .contact-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 5px;
    }

    .contact-header i {
        color: #ff4d4f;
    }

    .ticket-table td {
        padding: 8px;
        border: 1px solid #ddd;
    }
    `;
    document.head.appendChild(style);

    // Thêm vào cuối file JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Xử lý active menu
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Xóa active class từ tất cả links
                navLinks.forEach(l => l.classList.remove('active'));
                // Thêm active class vào link được click
                this.classList.add('active');
                
                // Ngăn chặn hành vi mặc định của link
                e.preventDefault();
                
                // Sau này có thể thêm logic chuyển trang ở đây
                const page = this.textContent.trim();
                console.log(`Chuyển đến trang: ${page}`);
            });
        });
    });

    // Thêm vào cuối file JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Xử lý sự kiện cho các nút trong user profile
        const userActionButtons = document.querySelectorAll('.user-action-btn');
        
        userActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('fa-sign-out-alt')) {
                    // Xử lý đăng xuất
                    console.log('Đăng xuất');
                    // Thêm logic đăng xuất đây
                } else if (icon.classList.contains('fa-user-cog')) {
                    // Xử lý cài đặt tài khoản
                    console.log('Mở cài đặt tài khoản');
                    // Thêm logic mở cài đặt tài khoản ở đây
                }
            });
        });
    });

    // Thêm hàm để cập nhật danh sách cuộc gọi
    function updateRecentCalls(calls) {
        const tbody = document.querySelector('.recent-calls-table tbody');
        if (!tbody) return;

        // Giới hạn chỉ lấy 10 cuộc gọi gần nhất
        const recentCalls = calls.slice(0, 10);

        tbody.innerHTML = recentCalls.map(call => `
            <tr>
                <td>${formatDate(call.time)}</td>
                <td>${call.phone}</td>
                <td><span class="call-status ${call.status === 'Đã tiếp nhận' ? 'incoming' : 'missed'}">${call.status}</span></td>
                <td>${call.duration}</td>
            </tr>
        `).join('');
    }

    // Thêm dữ liệu mẫu để test
    const mockRecentCalls = [
        {
            time: "2024-03-20T10:45:23",
            phone: "0123456789",
            status: "Đã tiếp nhận",
            duration: "05:23"
        },
        {
            time: "2024-03-20T10:30:15",
            phone: "0987654321",
            status: "Nhỡ",
            duration: "00:00"
        },
        {
            time: "2024-03-20T10:15:45",
            phone: "0369852147",
            status: "Đã tiếp nhận",
            duration: "03:45"
        },
        {
            time: "2024-03-20T10:00:30",
            phone: "0147852369",
            status: "Đã tiếp nhận",
            duration: "08:12"
        },
        {
            time: "2024-03-20T09:45:20",
            phone: "0258963147",
            status: "Nhỡ",
            duration: "00:00"
        },
        {
            time: "2024-03-20T09:30:10",
            phone: "0741852963",
            status: "Đã tiếp nhận",
            duration: "02:18"
        },
        {
            time: "2024-03-20T09:15:05",
            phone: "0951753852",
            status: "Đã tiếp nhận",
            duration: "04:55"
        },
        {
            time: "2024-03-20T09:00:00",
            phone: "0753951852",
            status: "Nhỡ",
            duration: "00:00"
        },
        {
            time: "2024-03-20T08:45:30",
            phone: "0852963741",
            status: "Đã tiếp nhận",
            duration: "06:32"
        },
        {
            time: "2024-03-20T08:30:25",
            phone: "0963852741",
            status: "Đã tiếp nhận",
            duration: "03:15"
        }
    ];

    // Cập nhật hàm fetchRecentCalls để sử dụng dữ liệu mẫu
    function fetchRecentCalls() {
        // Giả lập API call với setTimeout
        setTimeout(() => {
            updateRecentCalls(mockRecentCalls);
        }, 500);
    }

    // Cập nhật event listener
    document.addEventListener('DOMContentLoaded', function() {
        // Gọi fetchRecentCalls khi trang được tải
        fetchRecentCalls();
        
        // Cập nhật dữ liệu mỗi 30 giây
        setInterval(fetchRecentCalls, 30000);
    });

    // Thêm event listener khi DOM đã sẵn sàng
    document.addEventListener('DOMContentLoaded', function() {
        // Khởi tạo contact info với giá trị null
        updateCustomerInfo({
            name: null,
            id: null,
            code: null,
            email: null
        });
        
        // ... các event listener khác giữ nguyên
    });
