package com.citysafari.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "search_history", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_search_date", columnList = "search_date"),
    @Index(name = "idx_city_name", columnList = "city_name")
})
public class SearchHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "city_name", nullable = false)
    private String cityName;
    
    @Column(name = "search_date")
    @CreationTimestamp
    private LocalDateTime searchDate;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    // Constructors
    public SearchHistory() {}
    
    public SearchHistory(User user, String cityName, String ipAddress) {
        this.user = user;
        this.cityName = cityName;
        this.ipAddress = ipAddress;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getCityName() {
        return cityName;
    }
    
    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
    
    public LocalDateTime getSearchDate() {
        return searchDate;
    }
    
    public void setSearchDate(LocalDateTime searchDate) {
        this.searchDate = searchDate;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}
