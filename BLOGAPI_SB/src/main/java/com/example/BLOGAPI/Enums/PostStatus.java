package com.example.BLOGAPI.Enums;

public enum PostStatus {
    DRAFT("Draft - Not published yet"),
    PUBLISHED("Published and visible to readers"),
    ARCHIVED("Archived - No longer active"),
    SCHEDULED("Scheduled for future publication");

    private String description;

    PostStatus(String description){
        this.description=description;
    }
    public String getDescription(){ return description;}

}
