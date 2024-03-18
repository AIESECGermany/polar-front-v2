import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApplicantDataDetail, MemberData, MemberDataDetail } from './interfaces';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  domain = environment.serverUrl + '/members/';
  memberCountUrl = this.domain + 'count';
  previewAllMembersUrl = this.domain + 'preview/all';
  previewCurrentMembersUrl = this.domain + 'preview/current';
  detailOneMemberUrl = this.domain + 'detail/';
  createNewMemberUrl = this.domain + 'new';
  updateMemberUrl = this.domain + 'update/';
  addNewRoleUrl = this.domain + 'add-new-role/';
  addMemberInfoUrl = this.domain + 'add-member-info/';
  verifyMembershipUrl = this.domain + 'verify-membership/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ){}

  public getNumberOfMembers(): Observable<number> {
    return this.http.get<number>(this.memberCountUrl, { params: { lc: this.authService.user.lc }});
  }

  public getMembers(archived: boolean): Observable<MemberData[]> {
    if(archived) {
      return this.http.get<MemberData[]>(this.previewAllMembersUrl, { params: { lc: this.authService.user.lc }});
    } else {
      return this.http.get<MemberData[]>(this.previewCurrentMembersUrl, { params: { lc: this.authService.user.lc }});
    }
  }

  public getMemberDetails(_id: number): Observable<MemberDataDetail> {
    return this.http.get<MemberDataDetail>(
      this.detailOneMemberUrl + _id.toString(), 
      {
        headers: {'Access-Control-Allow-Origin': '*'},
        params: { lc: this.authService.user.lc }
      }
    );
  }

  public createNewMember(member: ApplicantDataDetail): Observable<string>{
    return this.http.post<string>(this.createNewMemberUrl, member, { params: { lc: this.authService.user.lc }});
  }

  public updateMember(member: MemberDataDetail): Observable<MemberDataDetail> {
    return this.http.put<MemberDataDetail>(
      this.updateMemberUrl,
      member,
      {
        headers: {'Access-Control-Allow-Origin': '*'},
        params: { lc: this.authService.user.lc }
      }
    );
  }

  public addNewRole(member: MemberDataDetail): Observable<MemberDataDetail> {
    return this.http.put<MemberDataDetail>(
      this.addNewRoleUrl,
      member,
      {
        headers: {'Access-Control-Allow-Origin': '*'},
        params: { lc: this.authService.user.lc }
      }
    );
  }

  public addMemberInfo(member: MemberDataDetail): Observable<MemberDataDetail> {
    return this.http.put<MemberDataDetail>(
      this.addMemberInfoUrl,
      member,
      {
        headers: {'Access-Control-Allow-Origin': '*'},
        params: { lc: this.authService.user.lc }
      }
    );
  }

  public verifyMembership(member: MemberDataDetail): Observable<MemberDataDetail> {
    return this.http.put<MemberDataDetail>(
      this.verifyMembershipUrl,
      member,
      {
        headers: {'Access-Control-Allow-Origin': '*'},
        params: { lc: this.authService.user.lc }
      }
    );
  }
}
